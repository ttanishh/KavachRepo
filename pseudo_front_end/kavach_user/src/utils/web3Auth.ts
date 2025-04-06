
import { generateTransactionHash } from "./blockchain";

// This is a mock implementation that simulates Web3 authentication
// In a real app, this would connect to MetaMask, WalletConnect, or similar

interface AuthMessage {
  phoneNumber: string;
  timestamp: number;
  nonce: string;
}

export const generateNonce = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Simulate signing a message with Web3
export const signAuthMessage = async (phoneNumber: string): Promise<string> => {
  // In a real app, this would prompt the user to sign a message with their wallet
  // Here we just simulate it with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const hash = generateTransactionHash(); // Using our blockchain mock utility
      resolve(hash);
    }, 1000);
  });
};

// Verify a signed message (mock implementation)
export const verifySignature = async (signedHash: string, phoneNumber: string): Promise<boolean> => {
  // In a real app, this would verify the signature against the phone number
  // Here we just simulate a successful verification
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // Always verify in mock
    }, 800);
  });
};

// Store authenticated user in local storage
export const storeAuthUser = (phoneNumber: string, authHash: string) => {
  const user = {
    phoneNumber,
    authHash,
    timestamp: new Date().toISOString(),
    isAuthenticated: true
  };
  localStorage.setItem('authUser', JSON.stringify(user));
  return user;
};

// Get authenticated user from local storage
export const getAuthUser = () => {
  const userJson = localStorage.getItem('authUser');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error("Failed to parse auth user", e);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const user = getAuthUser();
  return !!user?.isAuthenticated;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('authUser');
};
