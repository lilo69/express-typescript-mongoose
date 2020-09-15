import httpStatus from 'http-status';

class APIError extends Error {
  public httpStatusCode: number;

  constructor(
    message: string,
    httpStatusCode = httpStatus.INTERNAL_SERVER_ERROR,
    error?: Error
  ) {
    super(!error ? message : error.message);
    this.name = error && error.name ? error.name : this.constructor.name;
    this.httpStatusCode = httpStatusCode;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default APIError;
