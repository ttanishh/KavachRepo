
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import EmergencyReportForm from "@/components/EmergencyReportForm";
import PhoneAuth from "@/components/PhoneAuth";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Shield, Info, CheckCircle2 } from "lucide-react";
import { getAuthUser, isAuthenticated } from "@/utils/web3Auth";

const EmergencyReport = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  
  // Check if user is already authenticated on mount
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getAuthUser();
      setIsAuth(true);
      setPhoneNumber(user?.phoneNumber || null);
    }
  }, []);
  
  const handleAuthSuccess = (phone: string) => {
    setIsAuth(true);
    setPhoneNumber(phone);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 flex-1">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold mb-2 text-red-600 flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Emergency Report
          </h1>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Blockchain-Secured Reporting</AlertTitle>
            <AlertDescription>
              This emergency reporting system securely records incidents on a blockchain for transparency and immutability. 
              Your phone number is verified and linked to your reports, but no cryptocurrency wallet is required.
            </AlertDescription>
          </Alert>
          
          {!isAuth ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Secure Authentication</h2>
              <p className="text-muted-foreground">
                Before submitting an emergency report, please verify your phone number and complete blockchain authentication.
              </p>
              <PhoneAuth onAuthSuccess={handleAuthSuccess} />
              <div className="pt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  For demonstration purposes, use code <span className="font-mono">123456</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">Authenticated Securely</p>
                  <p className="text-green-700 text-sm">
                    Phone: <strong>{phoneNumber}</strong> - Verified with blockchain authentication
                  </p>
                </div>
              </div>
              <EmergencyReportForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyReport;
