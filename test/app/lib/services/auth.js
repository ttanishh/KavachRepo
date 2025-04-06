import jwt from 'jsonwebtoken';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'kavach';
const TOKEN_EXPIRY = '7d'; // 7 days

export const authService = {
  // Generate JWT token
  generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  },
  
  // Verify JWT token
  async verifyToken(token) {
    try {
      if (!token) return null;
      
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  },
  
  // Firebase email/password sign in
  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },
  
  // Create user with email/password
  async createUserWithEmail(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('User creation error:', error);
      throw error;
    }
  },
  
  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },
  
  // Get user from request cookies
  async getUserFromRequest(cookieStore) {
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }
    
    return await this.verifyToken(token);
  }
};
