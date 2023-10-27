/**
 * @packageDocumentation A small library for common chat app functions
 */
/**
 * A class that represents a deferred operation.
 * @public
 */
export class Deferred<T> {
    // The promise object associated with the deferred operation.
    #_promise: Promise<T>
    /**
     * The function to call to resolve the deferred operation.
     */
    #_resolve!: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[0]
    /**
     * The function to call to reject the deferred operation.
     */
    #_reject!: Parameters<ConstructorParameters<typeof Promise<T>>[0]>[1]
    /**
     * Creates a new instance of the Deferred class.
     */
    constructor() {
        this.#_promise = new Promise<T>((resolve, reject) => {
            this.#_resolve = resolve
            this.#_reject = reject
        })
    }
    /**
     * Gets the promise object associated with the deferred operation.
     */
    get promise() {
        return this.#_promise
    }
    /**
     * Gets the function to call to resolve the deferred operation.
     */
    get resolve() {
        return this.#_resolve
    }
    /**
     * Gets the function to call to reject the deferred operation.
     */
    get reject() {
        return this.#_reject
    }
}
/**
 * Stringify an Error instance
 * @param err - The error to stringify
 * @internal
 */
export function stringifyErrorValue(err: Error): string {
    return `${err.name.toUpperCase()}: ${err.message}
${err.stack || '(no stack trace information)'}`
}
/**
 * Stringify a thrown value
 *
 * @param errorDescription - A contextual description of the error
 * @param err - The thrown value
 * @beta
 */
export function stringifyError(err: unknown, errorDescription?: string) {
    return `${errorDescription ?? "( no error description )"}\n${err instanceof Error
            ? stringifyErrorValue(err)
            : err
                ? '' + String(err)
                : '(missing error information)'
        }`
}