
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ExternalLink, RefreshCw, XCircle, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getTransactionStatus } from "@/utils/blockchain";
import { getAuthUser } from "@/utils/web3Auth";

interface BlockchainInfoProps {
  reportId: string;
  transactionHash: string;
}

const BlockchainInfo = ({ reportId, transactionHash }: BlockchainInfoProps) => {
  const [status, setStatus] = useState<"pending" | "confirmed" | "failed" | "not_found">("pending");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const authUser = getAuthUser();
  
  // Check status on component mount
  useEffect(() => {
    checkStatus();
    // Set up periodic checking
    const interval = setInterval(checkStatus, 10000); // Check every 10 seconds
    intervalRef.current = interval;
    
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [transactionHash]);
  
  const checkStatus = async () => {
    if (!transactionHash) return;
    
    const currentStatus = await getTransactionStatus(transactionHash);
    setStatus(currentStatus);
    
    // Stop periodic checking if we reach a final state
    if (currentStatus === "confirmed" || currentStatus === "failed") {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    }
  };
  
  const refreshStatus = async () => {
    setIsRefreshing(true);
    await checkStatus();
    setIsRefreshing(false);
    
    toast({
      title: "Blockchain Status Updated",
      description: `Transaction is now ${status}.`,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            Blockchain Verification
            {status === "confirmed" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            {status === "pending" && <AlertCircle className="h-4 w-4 text-amber-500" />}
            {status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
          </div>
          {authUser && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Shield className="h-3 w-3" />
              Authenticated
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-3 gap-1">
            <div className="font-medium">Report ID:</div>
            <div className="col-span-2 font-mono">{reportId}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-1">
            <div className="font-medium">TX Hash:</div>
            <div className="col-span-2 font-mono text-xs truncate">{transactionHash}</div>
          </div>
          
          {authUser && (
            <div className="grid grid-cols-3 gap-1">
              <div className="font-medium">Verified By:</div>
              <div className="col-span-2">{authUser.phoneNumber}</div>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-1">
            <div className="font-medium">Status:</div>
            <div className="col-span-2">
              {status === "confirmed" && (
                <span className="text-green-600 font-medium">Confirmed</span>
              )}
              {status === "pending" && (
                <span className="text-amber-600 font-medium">Pending</span>
              )}
              {status === "failed" && (
                <span className="text-red-600 font-medium">Failed</span>
              )}
              {status === "not_found" && (
                <span className="text-gray-600 font-medium">Not Found</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={refreshStatus}
              disabled={isRefreshing || status === "confirmed"}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                  Checking...
                </>
              ) : (
                "Refresh Status"
              )}
            </Button>
            
            <Button
              variant="link"
              size="sm"
              className="text-xs"
              asChild
            >
              <a 
                href={`https://explorer.example.com/tx/${transactionHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on Explorer
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainInfo;
