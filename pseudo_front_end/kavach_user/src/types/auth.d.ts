
// Extending the AuthState interface to include proper typing for auth responses
import { User } from './index';

export interface AuthResponse {
  user: User;
  token: string;
}

declare global {
  interface Window {
    google?: any;
  }
}
