
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Check, Loader2 } from "lucide-react";

interface PhoneAuthFormProps {
  onAuthenticated: (phoneNumber: string, token: string) => void;
}

export function PhoneAuthForm({ onAuthenticated }: PhoneAuthFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, we would integrate with a service like Twilio Verify
  // This is a mock implementation for demonstration purposes
  const requestOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call to request OTP
      // In production, this would be a real API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Record IP address for security (would be done server-side)
      console.log("IP would be recorded on the server side");
      
      toast.success("Verification code sent!", {
        description: "Please check your phone for the verification code."
      });
      
      setStep("otp");
    } catch (error) {
      toast.error("Failed to send verification code", {
        description: "Please try again later."
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error("Please enter a valid verification code");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would return a JWT token
      const mockToken = "mock-auth-token-" + Date.now();
      
      toast.success("Phone verified successfully!", {
        description: "You are now signed in."
      });
      
      // Call the onAuthenticated callback with phone number and token
      onAuthenticated(phoneNumber, mockToken);
    } catch (error) {
      toast.error("Invalid verification code", {
        description: "Please try again."
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Civic Eye Witness</CardTitle>
        <CardDescription>
          {step === "phone" 
            ? "Enter your phone number to get started" 
            : "Enter the verification code sent to your phone"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "phone" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-12"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Verification code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="h-12 text-center text-2xl letter-spacing-4"
              />
              <p className="text-sm text-muted-foreground">
                We sent a code to {phoneNumber}
              </p>
            </div>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto"
              onClick={() => setStep("phone")}
            >
              Change phone number
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {step === "phone" ? (
          <Button 
            className="w-full h-12" 
            onClick={requestOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Code
              </>
            ) : (
              "Continue"
            )}
          </Button>
        ) : (
          <Button 
            className="w-full h-12" 
            onClick={verifyOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying
              </>
            ) : (
              "Verify"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
