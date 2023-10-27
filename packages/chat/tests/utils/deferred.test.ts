import { Deferred } from 'chat/src/utils/deferred'

describe('Utils - Deferred', () => {
  /**
   * @type {Deferred}
   */
  let deferred

  beforeEach(() => {
    deferred = new Deferred('Test Deferred')
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
