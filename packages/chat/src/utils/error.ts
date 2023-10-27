/**
 * Stringify an Error instance
 * @param err - The error to stringify
 */
function stringifyErrorValue(err: Error): string {
  return `${err.name.toUpperCase()}: ${err.message}
  ${err.stack ?? '(no stack trace information)'}`
}

/**
 * Stringify a thrown value
 *
 * @param errorDescription
 * @param {any} err
 * @return {string}
 */
export function stringifyError(errorDescription: string, err: unknown) {
  return `${errorDescription}\n${
    err instanceof Error
      ? stringifyErrorValue(err)
      : String(err)
      ? '' + err
      : '(missing error information)'
  }`
}
