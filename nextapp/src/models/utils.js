import { Timestamp } from '@/lib/firebase';

/**
 * Converts JavaScript Date to Firestore Timestamp
 * @param {Date|null} date - JavaScript Date object
 * @returns {Timestamp|null} Firestore Timestamp or null
 */
export const dateToTimestamp = (date) => {
  if (!date) return null;
  return Timestamp.fromDate(new Date(date));
};

/**
 * Normalizes a phone number to international format
 * @param {string} phoneNumber - Phone number input
 * @returns {string} Normalized phone number
 */
export const normalizePhoneNumber = (phoneNumber) => {
  // Remove non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Add country code if not present (assumes India +91)
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  
  // If it already has country code
  if (digits.length > 10 && !phoneNumber.startsWith('+')) {
    return `+${digits}`;
  }
  
  // If it already has the plus sign, return as is
  return phoneNumber;
};