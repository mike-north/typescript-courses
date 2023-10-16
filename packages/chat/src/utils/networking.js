import { stringifyError } from './error'
import { HTTPError } from './http-error.cjs'

/**
 *
 * @param {RequestInfo} input
 * @param {RequestInit} [init]
 */
async function getJSON(input, init) {
  try {
    const response = await fetch(input, init)
    const responseJSON = await response.json()
    return { response, json: responseJSON }
  } catch (err) {
    throw new Error(
      stringifyError(
        `Networking/getJSON: An error was encountered while fetching ${JSON.stringify(
          input,
        )}`,
        err,
      ),
    )
  }
}

/**
 *
 * @param {string} path
 * @param {RequestInit} [init]
 */
export async function apiCall(path, init) {
  let response
  /** @type {{}} */
  let json
  try {
    const jsonRespInfo = await getJSON(`/api/${path}`, init)
    response = jsonRespInfo.response
    json = jsonRespInfo.json
  } catch (err) {
    if (err instanceof HTTPError) throw err
    throw new Error(
      stringifyError(
        `Networking/apiCall: An error was encountered while making api call to ${path}`,
        err,
      ),
    )
  }
  if (!response.ok) {
    json = null
    throw new HTTPError(response, 'Problem while making API call')
  }
  return json
}
