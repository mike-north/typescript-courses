import { HTTPError, HTTPErrorKind } from 'chat/src/utils/http-error.cjs'

describe('HTTPError', () => {
  test('should set the kind property correctly for a 1xx status code', () => {
    const info = { status: 100, statusText: 'Continue' }
    const error = new HTTPError(info, 'Test error message')
    expect(error.kind).toBe(HTTPErrorKind.Information)
  })

  test('should set the kind property correctly for a 2xx status code', () => {
    const info = { status: 200, statusText: 'OK' }
    const error = new HTTPError(info, 'Test error message')
    expect(error.kind).toBe(HTTPErrorKind.Success)
  })

  test('should set the kind property correctly for a 3xx status code', () => {
    const info = { status: 300, statusText: 'Multiple Choices' }
    const error = new HTTPError(info, 'Test error message')
    expect(error.kind).toBe(HTTPErrorKind.Redirect)
  })

  test('should set the kind property correctly for a 4xx status code', () => {
    const info = { status: 400, statusText: 'Bad Request' }
    const error = new HTTPError(info, 'Test error message')
    expect(error.kind).toBe(HTTPErrorKind.Client)
  })

  test('should set the kind property correctly for a 5xx status code', () => {
    const info = { status: 500, statusText: 'Internal Server Error' }
    const error = new HTTPError(info, 'Test error message')
    expect(error.kind).toBe(HTTPErrorKind.Server)
  })

  test('should throw an error for an unknown status code', () => {
    const info = { status: 999, statusText: 'Unknown' }
    expect(() => new HTTPError(info, 'Test error message')).toThrow(
      'Unknown HTTP status code 999',
    )
  })
})
