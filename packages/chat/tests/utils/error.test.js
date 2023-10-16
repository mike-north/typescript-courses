import { stringifyError } from 'chat/src/utils/error'

describe('Utils - stringifyError', () => {
  it('should stringify an Error instance correctly', () => {
    const errorDescription = 'Test Error'
    const testError = new Error('This is a test error')
    const expectedString = `${errorDescription}\n${testError.name.toUpperCase()}: ${
      testError.message
    }\n  ${testError.stack}`

    const result = stringifyError(errorDescription, testError)

    expect(result).toBe(expectedString)
  })

  it('should stringify a non-Error value correctly', () => {
    const errorDescription = 'Test Error'
    const testValue = 'This is a test value'
    const expectedString = `${errorDescription}\n${testValue}`

    const result = stringifyError(errorDescription, testValue)

    expect(result).toBe(expectedString)
  })

  it('should handle missing error information', () => {
    const errorDescription = 'Test Error'
    const expectedString = `${errorDescription}\n(missing error information)`

    const result = stringifyError(errorDescription, null)

    expect(result).toBe(expectedString)
  })

  it('should handle Error instance without a stack trace', () => {
    const errorDescription = 'Test Error'
    const testError = new Error('This is a test error without stack')
    testError.stack = undefined
    const expectedString = `${errorDescription}\n${testError.name.toUpperCase()}: ${
      testError.message
    }\n  (no stack trace information)`

    const result = stringifyError(errorDescription, testError)

    expect(result).toBe(expectedString)
  })
})
