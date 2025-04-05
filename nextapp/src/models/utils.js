import { Timestamp } from '../lib/firebase';

/**
 * Helper function to convert JavaScript Date to Firestore Timestamp
 * @param {Date|Timestamp|null} date - Date to convert
 * @returns {Timestamp|null} Firestore Timestamp or null
 */
export const dateToTimestamp = (date) => {
  if (!date) return null;
  return date instanceof Date ? Timestamp.fromDate(date) : date;
};