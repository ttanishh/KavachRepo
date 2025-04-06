import { collection, doc, Timestamp } from '../lib/firebase';
import { dateToTimestamp } from './utils';

/**
 * @typedef {Object} User
 * @property {string} id 
 * @property {string} username
 * @property {string} email
 * @property {string} [fullName]
 * @property {string} [phone]
 * @property {boolean} isActive
 * @property {boolean} isEmergencyUser
 * @property {Date} createdAt
 * @property {Date} [lastLogin]
 * @property {string} [otp] - One-time password for verification
 * @property {Date} [otpExpiresAt] - OTP expiration timestamp
 */

const userConverter = {
  toFirestore: (user) => {
    return {
      username: user.username,
      email: user.email,
      fullName: user.fullName || null,
      phone: user.phone || null,
      isActive: user.isActive,
      isEmergencyUser: user.isEmergencyUser || false,
      createdAt: dateToTimestamp(user.createdAt),
      lastLogin: dateToTimestamp(user.lastLogin),
      otp: user.otp || null,
      otpExpiresAt: dateToTimestamp(user.otpExpiresAt)
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      isActive: data.isActive,
      isEmergencyUser: data.isEmergencyUser || false,
      createdAt: data.createdAt?.toDate(),
      lastLogin: data.lastLogin?.toDate(),
      otp: data.otp,
      otpExpiresAt: data.otpExpiresAt?.toDate()
    };
  }
};

// Collection reference
const usersCollection = 'users';

// Helper functions that return the actual reference
const users = (db) => collection(db, usersCollection);
const userDoc = (db, id) => id ? doc(db, usersCollection, id) : doc(collection(db, usersCollection));

export { users, userDoc, userConverter, usersCollection };