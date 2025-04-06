
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, MapPin, Calendar } from "lucide-react";
import { Report, ReportStatus } from "@/types/report";
import { formatDistanceToNow } from "date-fns";

interface ReportCardProps {
  report: Report;
  showDetails?: boolean;
  onViewDetails?: (id: string) => void;
}

export function ReportCard({ report, showDetails = false, onViewDetails }: ReportCardProps) {
  const renderStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return <span className="status-badge-pending">Pending Review</span>;
      case "investigating":
        return <span className="status-badge-investigating">Investigating</span>;
      case "resolved":
        return <span className="status-badge-resolved">Resolved</span>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="report-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate">{report.title}</CardTitle>
          {renderStatusBadge(report.status)}
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-3 mb-2">
          {report.description}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> 
          {report.location.address || `${report.location.latitude.toFixed(4)}, ${report.location.longitude.toFixed(4)}`}
        </div>
      </CardContent>
      {!showDetails && onViewDetails && (
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full flex items-center gap-1"
            onClick={() => onViewDetails(report.id)}
          >
            <Eye className="h-4 w-4" /> View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
