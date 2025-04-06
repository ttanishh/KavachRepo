import { Timestamp } from 'firebase/firestore';

export function dateToTimestamp(date) {
  if (!date) return null;
  
  if (date instanceof Timestamp) {
    return date;
  }
  
  const jsDate = date instanceof Date ? date : new Date(date);
  return Timestamp.fromDate(jsDate);
}

export function timestampToDate(timestamp) {
  if (!timestamp) return null;
  
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  if (timestamp instanceof Timestamp || (timestamp && typeof timestamp.toDate === 'function')) {
    return timestamp.toDate();
  }
  
  return new Date(timestamp);
}
