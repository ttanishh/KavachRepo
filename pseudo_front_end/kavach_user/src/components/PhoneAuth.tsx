
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Phone, Check, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { signAuthMessage, storeAuthUser, generateNonce } from "@/utils/web3Auth";

interface PhoneAuthProps {
  onAuthSuccess: (phoneNumber: string) => void;
}

const PhoneAuth = ({ onAuthSuccess }: PhoneAuthProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "blockchain">("phone");
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();

  const handleSendCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulating API call to send OTP
    setTimeout(() => {
      toast({
        title: "Verification Code Sent",
        description: `A code has been sent to ${phoneNumber}. Use code 123456 for demo.`,
      });
      setStep("otp");
      setLoading(false);
    }, 1500);
  };

  const handleVerifyCode = async () => {
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulating API call to verify OTP
    setTimeout(() => {
      // For demo purposes, accept 123456 as valid code
      if (otpCode === "123456") {
        toast({
          title: "Phone Verification Successful",
          description: "Proceeding with blockchain authentication.",
        });
        setStep("blockchain");
      } else {
        toast({
          title: "Invalid Code",
          description: "The code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
        setOtpCode("");
      }
      setLoading(false);
    }, 1500);
  };

  const handleBlockchainAuth = async () => {
    setIsAuthenticating(true);
    
    try {
      // Generate a nonce for this authentication attempt
      const nonce = generateNonce();
      
      // In a real app, this would trigger a wallet to sign a message
      // For our demo, we'll simulate this process
      const signedHash = await signAuthMessage(phoneNumber);
      
      // Store the authenticated user
      const user = storeAuthUser(phoneNumber, signedHash);
      
      toast({
        title: "Authentication Successful",
        description: "Your phone has been verified and securely linked on the blockchain.",
        variant: "default",
      });
      
      // Notify parent component
      onAuthSuccess(phoneNumber);
    } catch (error) {
      console.error("Authentication failed:", error);
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with blockchain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {step === "blockchain" 
            ? "Blockchain Authentication" 
            : "Phone Authentication"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === "phone" ? (
          <div className="space-y-4">
            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input 
                type="tel" 
                placeholder="Enter your phone number" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              We'll send a verification code to this number
            </p>
          </div>
        ) : step === "otp" ? (
          <div className="space-y-4">
            <p className="text-sm">Enter the verification code sent to {phoneNumber}</p>
            <div className="flex justify-center py-2">
              <InputOTP
                value={otpCode}
                onChange={setOtpCode}
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} index={index} {...slot} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs"
              onClick={() => setStep("phone")}
            >
              Change phone number
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-6">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="text-center">
              Your phone number ({phoneNumber}) has been verified.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Authenticate securely via blockchain technology to continue.
              No wallet or cryptocurrency is required.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={
            step === "phone" 
              ? handleSendCode 
              : step === "otp" 
                ? handleVerifyCode 
                : handleBlockchainAuth
          }
          disabled={
            loading || isAuthenticating ||
            (step === "phone" && phoneNumber.length < 10) || 
            (step === "otp" && otpCode.length < 6)
          }
        >
          {loading || isAuthenticating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {step === "phone" 
                ? "Sending..." 
                : step === "otp" 
                  ? "Verifying..." 
                  : "Authenticating..."}
            </>
          ) : (
            <>
              {step === "phone" 
                ? "Send Verification Code" 
                : step === "otp" 
                  ? "Verify Code" 
                  : "Complete Authentication"}
              {!loading && <Check className="ml-2 h-4 w-4" />}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PhoneAuth;
