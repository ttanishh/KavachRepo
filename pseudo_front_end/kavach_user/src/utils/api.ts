import { Crime, CrimeType, CrimeStatus, BlockchainStatus } from "@/types";
import { submitToBlockchain } from "./blockchain";

// Mock data for development
const mockCrimes: Crime[] = [
  {
    id: "1",
    type: CrimeType.THEFT,
    description: "Bicycle stolen from outside the library",
    location: {
      lat: 21.165,
      lng: 72.831,
      address: "Central Library, City Center"
    },
    date: "2025-04-01",
    time: "14:30",
    status: CrimeStatus.REPORTED
  },
  {
    id: "2",
    type: CrimeType.VANDALISM,
    description: "Graffiti on public building wall",
    location: {
      lat: 21.168,
      lng: 72.835,
      address: "Municipal Building, Park Street"
    },
    date: "2025-04-02",
    time: "23:15",
    status: CrimeStatus.UNDER_INVESTIGATION
  },
  {
    id: "3",
    type: CrimeType.ASSAULT,
    description: "Physical altercation between two individuals",
    location: {
      lat: 21.162,
      lng: 72.827,
      address: "Downtown Bar, Main Street"
    },
    date: "2025-04-03",
    time: "01:45",
    status: CrimeStatus.RESOLVED
  },
  {
    id: "4",
    type: CrimeType.FRAUD,
    description: "Credit card skimming device found on ATM",
    location: {
      lat: 21.170,
      lng: 72.840,
      address: "Shopping Mall ATM, Commerce Avenue"
    },
    date: "2025-04-02",
    time: "09:20",
    status: CrimeStatus.UNDER_INVESTIGATION
  }
];

// Mock API functions
export const fetchCrimes = async (): Promise<Crime[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCrimes);
    }, 500);
  });
};

export const submitCrime = async (crimeData: Omit<Crime, 'id' | 'status'>): Promise<Crime> => {
  // This now integrates with our blockchain utility
  return new Promise((resolve) => {
    setTimeout(async () => {
      // Submit data hash to blockchain
      const txHash = await submitToBlockchain({
        type: "CRIME_REPORT",
        reportType: crimeData.type,
        description: crimeData.description,
        location: crimeData.location,
        date: crimeData.date,
        time: crimeData.time,
        evidenceCount: crimeData.evidence?.length || 0,
        timestamp: new Date().toISOString(),
      });
      
      console.log(`Blockchain transaction submitted: ${txHash}`);
      
      const newCrime: Crime = {
        ...crimeData,
        id: `crime-${Date.now()}`,
        status: CrimeStatus.REPORTED,
        blockchainInfo: {
          transactionHash: txHash,
          status: BlockchainStatus.PENDING,
          timestamp: new Date().toISOString()
        }
      };
      
      mockCrimes.push(newCrime);
      resolve(newCrime);
    }, 1500); // Longer delay to simulate blockchain transaction
  });
};

// Authentication mock functions - now including phone verification
export const loginUser = async (email: string, password: string) => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock implementation - in real app this would verify credentials
      if (email && password) {
        resolve({
          user: {
            id: "user123",
            name: "Test User",
            email,
            role: "citizen"
          },
          token: "mock-jwt-token"
        });
      } else {
        throw new Error("Invalid credentials");
      }
    }, 800);
  });
};

export const registerUser = async (name: string, email: string, password: string) => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock implementation - in real app this would create an account
      if (name && email && password) {
        resolve({
          user: {
            id: "newuser123",
            name,
            email,
            role: "citizen"
          },
          token: "mock-jwt-token"
        });
      } else {
        throw new Error("Registration failed. Please fill all fields.");
      }
    }, 1000);
  });
};

export const verifyPhoneNumber = async (phoneNumber: string, code: string) => {
  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock implementation - in real app this would verify the code
      if (code === "123456") { // Demo code
        resolve({
          success: true,
          phoneNumber,
          verified: true
        });
      } else {
        reject(new Error("Invalid verification code"));
      }
    }, 1000);
  });
};
