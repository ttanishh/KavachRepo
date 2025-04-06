
import { useState, useEffect } from "react";
import { PhoneAuthForm } from "@/components/PhoneAuthForm";
import { useNavigate } from "react-router-dom";
import { saveAuthInfo, isAuthenticated } from "@/lib/authUtils";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      navigate("/dashboard");
    } else {
      setIsCheckingAuth(false);
    }
  }, [navigate]);
  
  const handleAuthenticated = (phoneNumber: string, token: string) => {
    saveAuthInfo(phoneNumber, token);
    navigate("/dashboard");
  };
  
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-fade">Checking authentication...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-civic-light p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-civic-primary">Civic Eye Witness</h1>
          <p className="text-muted-foreground mt-2">
            A decentralized platform for anonymous and secure crime reporting
          </p>
        </div>
        
        <PhoneAuthForm onAuthenticated={handleAuthenticated} />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Your privacy and security are our top priorities. All reports are stored securely and anonymously on the blockchain.
          </p>
        </div>
      </div>
    </div>
  );
}
