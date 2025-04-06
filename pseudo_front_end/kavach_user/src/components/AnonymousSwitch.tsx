
import { useState } from "react";
import { Shield, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnonymousSwitchProps {
  onToggle: (isAnonymous: boolean) => void;
  defaultChecked?: boolean;
}

const AnonymousSwitch = ({ onToggle, defaultChecked = false }: AnonymousSwitchProps) => {
  const [isAnonymous, setIsAnonymous] = useState(defaultChecked);

  const handleToggle = (checked: boolean) => {
    setIsAnonymous(checked);
    onToggle(checked);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="anonymous-mode" className="cursor-pointer">Anonymous Reporting</Label>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="max-w-xs">Your report will be submitted without revealing your identity, but still requires phone verification for security.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Switch
          id="anonymous-mode"
          checked={isAnonymous}
          onCheckedChange={handleToggle}
        />
      </div>
      
      {isAnonymous && (
        <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
          <div className="flex items-start gap-2">
            <EyeOff className="h-4 w-4 text-amber-500 mt-0.5" />
            <AlertDescription>
              Your personal information will be hidden from public view, but will still be cryptographically verifiable on the blockchain.
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default AnonymousSwitch;
