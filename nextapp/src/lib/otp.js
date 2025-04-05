/**
 * OTP generation, storage and verification utility
 * Uses user records in Firestore for persistence
 */
import { db } from './firebase';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { users } from '@/models/User';

/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP with expiration in user record
 * @param {string} phone Phone number
 * @param {string} otp OTP code
 * @param {number} expiresInMs Expiration time in milliseconds (default 10 minutes)
 * @returns {Promise<object>} Object with normalized phone and user data
 */
export async function storeOTP(phone, otp, expiresInMs = 10 * 60 * 1000) {
  // Normalize phone number
  const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
  
  console.log(`Storing OTP for ${normalizedPhone}: ${otp}`);
  
  // Calculate expiration time
  const expiresAt = new Date(Date.now() + expiresInMs);
  
  // Check if a user with this phone number exists
  const userQuery = query(collection(db, 'users'), where('phone', '==', normalizedPhone));
  const userSnapshot = await getDocs(userQuery);
  
  let userId;
  let isNewUser = false;
  
  if (!userSnapshot.empty) {
    // User exists, update their OTP
    const userDoc = userSnapshot.docs[0];
    userId = userDoc.id;
    
    await updateDoc(doc(db, 'users', userId), {
      otp,
      otpExpiresAt: expiresAt,
      updatedAt: serverTimestamp()
    });
    
    console.log(`Updated OTP for existing user ${userId}`);
  } else {
    // Create temporary user for this phone number
    isNewUser = true;
    const tempUsername = `temp_${normalizedPhone.replace(/\D/g, '').slice(-6)}`;
    const tempEmail = `temp_${normalizedPhone.replace(/\D/g, '')}@kavach.temp`;
    
    // Create a new document with auto ID
    const newUserRef = doc(collection(db, 'users'));
    userId = newUserRef.id;
    
    await setDoc(newUserRef, {
      username: tempUsername,
      email: tempEmail,
      phone: normalizedPhone,
      isActive: true,
      isEmergencyUser: true,
      isTemporaryUser: true,
      createdAt: serverTimestamp(),
      otp,
      otpExpiresAt: expiresAt
    });
    
    console.log(`Created temporary user ${userId} with OTP`);
  }
  
  return { 
    normalizedPhone, 
    userId,
    isNewUser
  };
}

/**
 * Verify OTP stored in user record
 * @param {string} phone Phone number
 * @param {string} otp OTP to verify
 * @returns {Promise<object>} Verification result with user data if successful
 */
export async function verifyOTP(phone, otp) {
  // Normalize phone number
  const normalizedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
  
  console.log(`Attempting to verify OTP for ${normalizedPhone}`);
  
  try {
    // Find user with this phone number
    const userQuery = query(collection(db, 'users'), where('phone', '==', normalizedPhone));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      console.log(`No user found with phone ${normalizedPhone}`);
      return { 
        valid: false, 
        message: 'No user found with this phone number' 
      };
    }
    
    // Get the user
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    
    // Check if user has an OTP set
    if (!userData.otp) {
      console.log(`User has no OTP set: ${userDoc.id}`);
      return { 
        valid: false, 
        message: 'No verification code found for this user' 
      };
    }
    
    // Check if OTP is expired
    const now = new Date();
    const expiresAt = userData.otpExpiresAt?.toDate() || new Date(0);
    
    if (now > expiresAt) {
      console.log(`OTP expired for user ${userDoc.id}`);
      
      // Clear expired OTP
      await updateDoc(doc(db, 'users', userDoc.id), {
        otp: null,
        otpExpiresAt: null,
        updatedAt: serverTimestamp()
      });
      
      return { 
        valid: false, 
        expired: true,
        message: 'Verification code has expired' 
      };
    }
    
    // Check if OTP matches
    const isValid = userData.otp === otp;
    
    if (isValid) {
      console.log(`OTP verified successfully for user ${userDoc.id}`);
      
      // Clear the OTP after successful verification
      await updateDoc(doc(db, 'users', userDoc.id), {
        otp: null,
        otpExpiresAt: null,
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return {
        valid: true,
        userId: userDoc.id,
        user: {
          id: userDoc.id,
          ...userData,
          password: undefined, // Remove password from response
          otp: undefined // Remove OTP from response
        },
        message: 'Verification successful'
      };
    } else {
      console.log(`Invalid OTP for user ${userDoc.id}: expected ${userData.otp}, got ${otp}`);
      return { 
        valid: false, 
        message: 'Invalid verification code' 
      };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      valid: false,
      error: error.message,
      message: 'An error occurred during verification'
    };
  }
}

/**
 * Create and store an emergency OTP
 * @param {string} phone Phone number
 * @returns {Promise<object>} Generated OTP and user data
 */
export async function createEmergencyOTP(phone) {
  const otp = generateOTP();
  const result = await storeOTP(phone, otp);
  return { otp, ...result };
}