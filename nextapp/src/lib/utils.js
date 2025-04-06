import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 * @param {...string} inputs - Class names to combine
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date object into a human-readable string
 * @param {Date|string|number} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) return 'N/A';
  
  // Convert to Date object if it's not already
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  // Default formatting options
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata' // Indian timezone
  };
  
  // Use only date part if showTime is false
  if (options.showTime === false) {
    delete defaultOptions.hour;
    delete defaultOptions.minute;
  }
  
  // Merge default options with provided options
  const formatterOptions = { ...defaultOptions, ...options };
  
  try {
    return new Intl.DateTimeFormat('en-IN', formatterOptions).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(dateObj);
  }
}
