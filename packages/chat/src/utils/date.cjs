const { format } = require('date-fns')

/**
 * Formats a given date object into a string with the format 'MMM dd, yyyy HH:MM:SS a'.
 *
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
function formatTimestamp(date) {
  return format(date, 'MMM dd, yyyy HH:MM:SS a')
}

module.exports = { formatTimestamp }