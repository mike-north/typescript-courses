/**
 * @enum {number}
 */
export const HTTPErrorKind = {
  Information: 100,
  Success: 200,
  Redirect: 300,
  Client: 400,
  Server: 500,
};

/**
 *
 * @param {number} status
 * @return {HTTPErrorKind}
 */
function determineKind(status) {
  if (status >= 100 && status < 200) return HTTPErrorKind.Information;
  else if (status < 300) return HTTPErrorKind.Success;
  else if (status < 400) return HTTPErrorKind.Redirect;
  else if (status < 500) return HTTPErrorKind.Client;
  else if (status < 600) return HTTPErrorKind.Server;
  else throw new Error(`Unknown HTTP status code ${status}`);
}

/** @param {HTTPErrorKind} kind */
export default class HTTPError extends Error {
  /**
   *
   * @param {Response} info
   * @param {string} message
   */
  constructor(info, message) {
    super(
      `HTTPError [status: ${info.statusText} (${info.status})]\n${message}`,
    );
    this.kind = determineKind(info.status);
  }
}
