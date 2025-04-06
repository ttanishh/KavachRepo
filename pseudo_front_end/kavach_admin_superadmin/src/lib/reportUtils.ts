
import { Report, ReportSubmission, ReportStatus } from "@/types/report";

// Mock database of reports for demo purposes
// In a real app, this would come from the blockchain and/or IPFS
let mockReports: Report[] = [
  {
    id: "1",
    title: "Suspicious activity near downtown park",
    description: "I witnessed several individuals behaving suspiciously around the playground equipment at Central Park around 10pm. They appeared to be exchanging packages.",
    location: {
      latitude: 40.785091,
      longitude: -73.968285,
      address: "Central Park, New York"
    },
    timestamp: "2023-04-01T22:15:00Z",
    status: "investigating",
    reporter: "anon-user-1"
  },
  {
    id: "2",
    title: "Hit and run incident on Main St",
    description: "A blue sedan hit a parked car and drove away without stopping. License plate partially visible, started with AB3.",
    location: {
      latitude: 40.712776,
      longitude: -74.005974,
      address: "123 Main St, New York"
    },
    timestamp: "2023-04-02T14:30:00Z",
    status: "pending",
    reporter: "anon-user-2"
  },
  {
    id: "3",
    title: "Graffiti on public building",
    description: "New graffiti appeared overnight on the east wall of the public library. Tags appear to be gang-related.",
    location: {
      latitude: 40.730610,
      longitude: -73.935242,
      address: "Public Library, Brooklyn"
    },
    timestamp: "2023-04-03T08:45:00Z",
    status: "resolved",
    reporter: "anon-user-1"
  }
];

// Mock function to submit a report
// In a real app, this would interact with the blockchain
export const mockSubmitReport = async (reportData: ReportSubmission): Promise<Report> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would call a smart contract function
  const newReport: Report = {
    id: `${Date.now()}`,
    ...reportData,
    status: "pending",
    reporter: `anon-user-${Math.floor(Math.random() * 1000)}`,
  };
  
  mockReports.push(newReport);
  return newReport;
};

// Get all reports (with optional filtering)
export const getReports = async (
  status?: ReportStatus,
  searchQuery?: string
): Promise<Report[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredReports = [...mockReports];
  
  if (status) {
    filteredReports = filteredReports.filter(report => report.status === status);
  }
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredReports = filteredReports.filter(report => 
      report.title.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      (report.location.address && report.location.address.toLowerCase().includes(query))
    );
  }
  
  // Sort by most recent
  return filteredReports.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Get reports by a specific anonymous user
export const getReportsByUser = async (userId: string): Promise<Report[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockReports
    .filter(report => report.reporter === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Get a specific report by ID
export const getReportById = async (id: string): Promise<Report | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockReports.find(report => report.id === id) || null;
};
