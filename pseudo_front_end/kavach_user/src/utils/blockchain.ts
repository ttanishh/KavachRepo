
// Mock blockchain functionality - in a real app this would connect to a real blockchain
// like Ethereum, Polygon, or similar

interface BlockchainTransaction {
  hash: string;
  status: "pending" | "confirmed" | "failed";
  timestamp: number;
  data: Record<string, any>;
}

// In-memory storage of transactions (simulating blockchain)
const transactions: BlockchainTransaction[] = [];

// Generate a random hash (mimicking blockchain transaction hashes)
export const generateTransactionHash = (): string => {
  return `0x${Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)).join('')}`;
};

// Submit a transaction to our mock blockchain
export const submitToBlockchain = async (data: Record<string, any>): Promise<string> => {
  // In a real app, this would be an actual blockchain transaction
  return new Promise((resolve) => {
    setTimeout(() => {
      const hash = generateTransactionHash();
      transactions.push({
        hash,
        status: "pending",
        timestamp: Date.now(),
        data
      });
      
      // Simulate blockchain confirmation after a delay
      setTimeout(() => {
        const tx = transactions.find(t => t.hash === hash);
        if (tx) {
          tx.status = Math.random() > 0.1 ? "confirmed" : "failed";
        }
      }, 5000 + Math.random() * 5000); // Random confirmation time
      
      resolve(hash);
    }, 1000);
  });
};

// Get transaction status from hash
export const getTransactionStatus = async (hash: string): Promise<"pending" | "confirmed" | "failed" | "not_found"> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tx = transactions.find(t => t.hash === hash);
      resolve(tx ? tx.status : "not_found");
    }, 500);
  });
};

// Get transaction data
export const getTransactionData = async (hash: string): Promise<Record<string, any> | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tx = transactions.find(t => t.hash === hash);
      resolve(tx ? tx.data : null);
    }, 500);
  });
};

// Smart contract interface (mock)
export const emergencyReportContract = {
  submitReport: async (reportData: any): Promise<string> => {
    // This would be a smart contract call in a real blockchain app
    return await submitToBlockchain({
      type: "EMERGENCY_REPORT",
      report: reportData,
      timestamp: Date.now()
    });
  },
  
  getReportStatus: async (txHash: string): Promise<"pending" | "confirmed" | "failed" | "not_found"> => {
    return getTransactionStatus(txHash);
  },
  
  verifyReportEvidence: async (reportId: string, evidenceHash: string): Promise<boolean> => {
    // Mock verification logic
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true); // Always verify in mock
      }, 1000);
    });
  }
};
