import { format } from 'date-fns';

/**
 * Formats a given date object into a string with the format 'MMM dd, yyyy HH:MM:SS a'.
 *
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
export function formatTimestamp(date) {
  return format(date, 'MMM dd, yyyy HH:MM:SS a');
}
