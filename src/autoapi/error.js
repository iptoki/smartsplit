/**
 * Error class for handling errors in the API
 *
 * Adds status and data arguments to return errors in JSON format
 */
class APIError extends Error {
  constructor(status, data, ...args) {
    super(data.message || "Internal Server Error", ...args);
    this.httpStatus = status;
    this.json = data;
    this.log = false;
  }
}

module.exports = APIError;
