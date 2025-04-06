
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ReportsList } from "@/components/ReportsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportForm } from "@/components/ReportForm";
import { getCurrentUser, isAuthenticated, logOut } from "@/lib/authUtils";
import { Report } from "@/types/report";
import { getReportsByReporterFromBlockchain } from "@/lib/contractInterface";
import { getReports } from "@/lib/reportUtils";
import { FilePlus, LogOut, User } from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [publicReports, setPublicReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState("my-reports");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        
        // Load user's reports
        const userReportsData = await getReportsByReporterFromBlockchain(
          currentUser.phoneNumber
        );
        setUserReports(userReportsData);
        
        // Load public reports
        const publicReportsData = await getReports();
        setPublicReports(publicReportsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);
  
  const handleViewDetails = (id: string) => {
    navigate(`/reports/${id}`);
  };
  
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-civic-primary p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Civic Eye Witness</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:text-white hover:bg-civic-dark/20"
              onClick={() => logOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 py-8">
        <Tabs defaultValue="my-reports" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="my-reports" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              My Reports
            </TabsTrigger>
            <TabsTrigger value="public-feed" className="flex items-center gap-2">
              Public Feed
            </TabsTrigger>
            <TabsTrigger value="new-report" className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              New Report
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-reports" className="mt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse-fade">Loading your reports...</div>
              </div>
            ) : (
              <ReportsList 
                title="My Reports" 
                reports={userReports}
                onViewDetails={handleViewDetails}
              />
            )}
          </TabsContent>
          
          <TabsContent value="public-feed" className="mt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-pulse-fade">Loading reports...</div>
              </div>
            ) : (
              <ReportsList 
                title="Recent Reports" 
                reports={publicReports}
                onViewDetails={handleViewDetails}
              />
            )}
          </TabsContent>
          
          <TabsContent value="new-report" className="mt-6 max-w-2xl mx-auto">
            <ReportForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
