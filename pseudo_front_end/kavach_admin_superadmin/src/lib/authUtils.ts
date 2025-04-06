
// Mock authentication utilities
// In a real app, these would interact with a server and blockchain

interface AuthUser {
  phoneNumber: string;
  token: string;
  userId: string;
}

const LOCAL_STORAGE_KEY = "civic-eye-auth";

// Save auth info to local storage
export const saveAuthInfo = (phoneNumber: string, token: string): void => {
  const user: AuthUser = {
    phoneNumber,
    token,
    // In a real app, this would be provided by the backend
    // For now, we'll create a mock user ID
    userId: `anon-user-${phoneNumber.slice(-4)}`
  };
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
};

// Get the current authenticated user
export const getCurrentUser = (): AuthUser | null => {
  const userJson = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as AuthUser;
  } catch (e) {
    console.error("Error parsing auth user from localStorage", e);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Log out the current user
export const logOut = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  window.location.href = "/";
};
