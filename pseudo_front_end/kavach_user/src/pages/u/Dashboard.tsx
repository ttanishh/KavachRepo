
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Map from "@/components/Map";
import CrimeCard from "@/components/CrimeCard";
import CrimeHeatmap from "@/components/CrimeHeatmap";
import VerificationBadge from "@/components/VerificationBadge";
import { Crime, CrimeType } from "@/types";
import { fetchCrimes } from "@/utils/api";
import { AlertTriangle, Shield, CheckCircle2, BarChart3, MapPin, LayersIcon } from "lucide-react";

const Dashboard = () => {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [crimeFilter, setCrimeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"map" | "list" | "heatmap">("map");
  
  useEffect(() => {
    const loadCrimes = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCrimes();
        setCrimes(data);
      } catch (error) {
        console.error("Error fetching crimes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCrimes();
  }, []);
  
  const filteredCrimes = crimes.filter((crime) => {
    if (crimeFilter === "all") return true;
    return crime.type === crimeFilter;
  });
  
  // Calculate stats
  const totalReported = crimes.length;
  const underInvestigation = crimes.filter(crime => crime.status === "Under Investigation").length;
  const resolved = crimes.filter(crime => crime.status === "Resolved").length;
  
  const getCrimeTypeCount = (type: CrimeType) => {
    return crimes.filter(crime => crime.type === type).length;
  };

  // Function to handle verification updates
  const handleVerificationUpdate = (reportId: string, newCount: number) => {
    setCrimes(prevCrimes => 
      prevCrimes.map(crime => 
        crime.id === reportId 
          ? { ...crime, verificationCount: newCount } 
          : crime
      )
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Crime Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and analyze reported crimes in real-time
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4 md:mt-0">
            <Select value={crimeFilter} onValueChange={setCrimeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by crime type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.values(CrimeType).map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "map" | "list" | "heatmap")} className="w-[250px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Reported</CardTitle>
              <Shield className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReported}</div>
              <p className="text-xs text-muted-foreground">Incidents reported</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
              <AlertTriangle className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{underInvestigation}</div>
              <p className="text-xs text-muted-foreground">Cases being investigated</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolved}</div>
              <p className="text-xs text-muted-foreground">Cases resolved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Highest Crime</CardTitle>
              <BarChart3 className="h-5 w-5 text-kavach-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(CrimeType).reduce((a, b) => 
                  getCrimeTypeCount(a) > getCrimeTypeCount(b) ? a : b, CrimeType.OTHER)}
              </div>
              <p className="text-xs text-muted-foreground">Most reported type</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "map" | "list" | "heatmap")}>
          <TabsContent value="map" className="mt-0">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 bg-muted/40">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-alert" />
                    <span className="font-medium text-sm">
                      Displaying {filteredCrimes.length} {filteredCrimes.length === 1 ? 'crime' : 'crimes'}
                    </span>
                  </div>
                </div>
                <Map crimes={filteredCrimes} interactive={false} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Crime Reports</CardTitle>
                <CardDescription>
                  Showing {filteredCrimes.length} {filteredCrimes.length === 1 ? 'report' : 'reports'} {crimeFilter !== 'all' ? `for ${crimeFilter}` : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-kavach-500"></div>
                  </div>
                ) : filteredCrimes.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No crime reports found matching your criteria</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCrimes.map((crime) => (
                      <div key={crime.id} className="space-y-2">
                        <CrimeCard crime={crime} />
                        <div className="flex justify-end px-4 pb-2">
                          <VerificationBadge 
                            reportId={crime.id} 
                            verificationCount={crime.verificationCount || 0}
                            onVerificationUpdated={(count) => handleVerificationUpdate(crime.id, count)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="heatmap" className="mt-0">
            <CrimeHeatmap />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
