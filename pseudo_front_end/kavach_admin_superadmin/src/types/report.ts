
export type ReportStatus = "pending" | "investigating" | "resolved";
export type CrimeCategory = "theft" | "assault" | "vandalism" | "fraud" | "harassment" | "other";

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  district?: string;
  city?: string;
  state?: string;
}

export interface Witness {
  id: string;
  description: string;
  contactHash?: string; // Hashed contact information if provided
}

export interface Evidence {
  type: "image" | "video" | "document" | "audio";
  ipfsHash: string;
  description: string;
  timestamp: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category: CrimeCategory;
  location: Location;
  timestamp: string;
  status: ReportStatus;
  reporter: string; // This would be a hashed or anonymized identifier
  witnesses?: Witness[];
  evidence?: Evidence[];
  ipfsHash?: string; // For additional details stored on IPFS
  transactionHash?: string; // Blockchain transaction hash
  blockNumber?: number; // Block number where the transaction was confirmed
  contractAddress?: string; // Address of the smart contract
  urgencyLevel?: 1 | 2 | 3 | 4 | 5; // 1-5 scale, 5 being most urgent
  officerAssigned?: string; // Assigned investigator (if any)
}

export interface ReportSubmission {
  title: string;
  description: string;
  category: CrimeCategory;
  location: Location;
  timestamp: string;
  witnesses?: Witness[];
  evidence?: Evidence[];
  urgencyLevel?: 1 | 2 | 3 | 4 | 5;
}
