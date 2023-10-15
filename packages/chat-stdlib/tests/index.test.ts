import { Deferred, stringifyError } from 'chat-stdlib'

describe('Utils - Deferred', () => {
  let deferred: Deferred<string>

  beforeEach(() => {
    deferred = new Deferred()
  })

  it('should create a new instance with a promise', () => {
    expect(deferred.promise).toBeInstanceOf(Promise)
  })

  it('should resolve the promise when calling resolve', async () => {
    const testValue = 'Resolved Value'
    deferred.resolve(testValue)

    await expect(deferred.promise).resolves.toBe(testValue)
  })

  it('should reject the promise when calling reject', async () => {
    const testError = new Error('Rejected Error')
    deferred.reject(testError)

    await expect(deferred.promise).rejects.toThrow(testError)
  })

  it('should have resolve and reject methods', () => {
    expect(typeof deferred.resolve).toBe('function')
    expect(typeof deferred.reject).toBe('function')
  })
})


describe('Utils - stringifyError', () => {
  it('should stringify an Error instance correctly', () => {
    const errorDescription = 'Test Error'
    const testError = new Error('This is a test error')
    const expectedString = `${errorDescription}\n${testError.name.toUpperCase()}: ${
      testError.message
    }\n${testError.stack}`

    const result = stringifyError(testError, errorDescription)

    expect(result).toBe(expectedString)
  })

  it('should stringify a non-Error value correctly', () => {
    const errorDescription = 'Test Error'
    const testValue = 'This is a test value'
    const expectedString = `${errorDescription}\n${testValue}`

    const result = stringifyError(testValue, errorDescription)

    expect(result).toBe(expectedString)
  })

  it('should handle missing error information', () => {
    const errorDescription = 'Test Error'
    const expectedString = `${errorDescription}\n(missing error information)`

    const result = stringifyError(null, errorDescription)

    expect(result).toBe(expectedString)
  })

  it('should handle Error instance without a stack trace', () => {
    const errorDescription = 'Test Error'
    const testError = new Error('This is a test error without stack')
    delete testError.stack
    const expectedString = `${errorDescription}\n${testError.name.toUpperCase()}: ${
      testError.message
    }\n(no stack trace information)`

    const result = stringifyError(testError, errorDescription)

    expect(result).toBe(expectedString)
  })
})
