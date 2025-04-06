
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Hammer, CheckCircle2 } from "lucide-react";
import { Crime, CrimeStatus } from "@/types";

interface CrimeCardProps {
  crime: Crime;
  compact?: boolean;
}

const CrimeCard = ({ crime, compact = false }: CrimeCardProps) => {
  // Function to get appropriate status badge
  const getStatusBadge = (status: CrimeStatus) => {
    switch (status) {
      case CrimeStatus.REPORTED:
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 flex gap-1 items-center">
            <AlertTriangle className="h-3 w-3" />
            <span>Reported</span>
          </Badge>
        );
      case CrimeStatus.UNDER_INVESTIGATION:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 flex gap-1 items-center">
            <Shield className="h-3 w-3" />
            <span>Investigating</span>
          </Badge>
        );
      case CrimeStatus.RESOLVED:
        return (
          <Badge className="bg-green-500 hover:bg-green-600 flex gap-1 items-center">
            <CheckCircle2 className="h-3 w-3" />
            <span>Resolved</span>
          </Badge>
        );
      case CrimeStatus.CLOSED:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 flex gap-1 items-center">
            <Hammer className="h-3 w-3" />
            <span>Closed</span>
          </Badge>
        );
    }
  };

  // Function to get appropriate crime type icon
  const getCrimeTypeIcon = () => {
    // Simple implementation - in real app you'd use different icons for crime types
    return <AlertTriangle className="h-4 w-4 text-alert" />;
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className={compact ? "py-3" : "py-4"}>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            {getCrimeTypeIcon()}
            <CardTitle className={compact ? "text-base" : "text-lg"}>{crime.type}</CardTitle>
          </div>
          {getStatusBadge(crime.status)}
        </div>
        <CardDescription className={compact ? "text-xs line-clamp-1" : "line-clamp-2"}>
          {crime.description}
        </CardDescription>
      </CardHeader>
      
      {!compact && (
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Date</p>
              <p>{crime.date}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Time</p>
              <p>{crime.time}</p>
            </div>
            {crime.location.address && (
              <div className="col-span-2">
                <p className="text-gray-500 dark:text-gray-400">Location</p>
                <p className="truncate">{crime.location.address}</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default CrimeCard;
