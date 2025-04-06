
import { useState } from "react";
import { ReportCard } from "@/components/ReportCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Report, ReportStatus } from "@/types/report";

interface ReportsListProps {
  reports: Report[];
  title: string;
  onViewDetails?: (id: string) => void;
}

export function ReportsList({ reports, title, onViewDetails }: ReportsListProps) {
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredReports = reports.filter(report => {
    // Filter by status
    if (statusFilter !== "all" && report.status !== statusFilter) {
      return false;
    }
    
    // Filter by search query
    if (
      searchQuery && 
      !report.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !report.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(report.location.address && report.location.address.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <div className="w-[180px]">
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as ReportStatus | "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-[200px]">
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
          </div>
        </div>
      </div>
      
      {filteredReports.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No reports found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
