import { formatTimestamp } from 'chat/src/utils/date.cjs'
import { format } from 'date-fns'

describe('Utils - formatTimestamp', () => {
  it('should format the date correctly', () => {
    // Example date: October 12, 2023, 14:30:00 UTC
    const testDate = new Date('2023-10-12T14:30:00Z')
    const expectedFormat = format(testDate, 'MMM dd, yyyy HH:MM:SS a')

    const result = formatTimestamp(testDate)

    expect(result).toBe(expectedFormat)
  })

  it('should return the correct format for a different date', () => {
    // Example date: January 1, 2020, 00:00:00 UTC
    const testDate = new Date('2020-01-01T00:00:00Z')
    const expectedFormat = format(testDate, 'MMM dd, yyyy HH:MM:SS a')

    const result = formatTimestamp(testDate)

    expect(result).toBe(expectedFormat)
  })
})
