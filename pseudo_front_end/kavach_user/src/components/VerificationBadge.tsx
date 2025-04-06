
import { useState } from "react";
import { Shield, Users, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/utils/web3Auth";

interface VerificationBadgeProps {
  verificationCount: number;
  reportId: string;
  onVerificationUpdated?: (newCount: number) => void;
}

const VerificationBadge = ({ verificationCount = 0, reportId, onVerificationUpdated }: VerificationBadgeProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);
  const [count, setCount] = useState(verificationCount);
  const { toast } = useToast();

  // Get verification status level
  const getVerificationLevel = () => {
    if (count >= 5) return "verified";
    if (count >= 2) return "reliable";
    return "unverified";
  };

  const verificationLevel = getVerificationLevel();

  // Get appropriate colors based on verification level
  const getLevelStyle = () => {
    switch (verificationLevel) {
      case "verified":
        return {
          color: "bg-green-100 text-green-800 hover:bg-green-200",
          icon: <Shield className="h-4 w-4 mr-1 text-green-600" />
        };
      case "reliable":
        return {
          color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
          icon: <Shield className="h-4 w-4 mr-1 text-blue-600" />
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
          icon: <Shield className="h-4 w-4 mr-1 text-gray-600" />
        };
    }
  };

  const { color, icon } = getLevelStyle();

  const handleVerify = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to verify a report",
        variant: "destructive",
      });
      return;
    }

    if (hasVerified) {
      toast({
        title: "Already Verified",
        description: "You have already verified this report",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Mock API call to verify the report
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCount = count + 1;
      setCount(newCount);
      setHasVerified(true);
      
      if (onVerificationUpdated) {
        onVerificationUpdated(newCount);
      }
      
      toast({
        title: "Report Verified",
        description: "Thank you for verifying this report",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "There was an error verifying this report",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={color}>
              {icon}
              <span className="flex items-center">
                {verificationLevel === "verified" && "Verified"}
                {verificationLevel === "reliable" && "Reliable"}
                {verificationLevel === "unverified" && "Unverified"}
                <Users className="ml-2 h-3 w-3" /> {count}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{count} {count === 1 ? 'person has' : 'people have'} verified this report</p>
            {
              verificationLevel === "verified" && 
              <p className="text-green-600">Highly trusted report</p>
            }
            {
              verificationLevel === "reliable" && 
              <p className="text-blue-600">Multiple verifications</p>
            }
            {
              verificationLevel === "unverified" && 
              <p>Needs more verification</p>
            }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {!hasVerified && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleVerify} 
          disabled={isVerifying || hasVerified}
          className="text-xs h-8"
        >
          {isVerifying ? "Verifying..." : "Verify"}
          {!isVerifying && <Check className="ml-1 h-3 w-3" />}
        </Button>
      )}
      
      {hasVerified && (
        <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
          <Check className="mr-1 h-3 w-3" /> You verified
        </Badge>
      )}
    </div>
  );
};

export default VerificationBadge;
