class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = 'Internal Server Error',
    errors = null,
    isOperational = true
  ) {
    super(message);

    this.name = this.constructor.name;
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', errors = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Conflict') {
    return new ApiError(409, message);
  }

  static validationError(message = 'Validation Error', errors = null) {
    return new ApiError(422, message, errors);
  }

  static internal(message = 'Internal Server Error', errors = null) {
    return new ApiError(500, message, errors, false);
  }

  toJSON() {
    const errorResponse = {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      timestamp: this.timestamp,
    };

    if (this.errors) {
      errorResponse.errors = this.errors;
    }

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = this.stack?.split('\n').map((line) => line.trim());
    }

    return errorResponse;
  }
}

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, null, false);
  }

  console.error(`${error.name}: ${error.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }

  res.status(error.statusCode).json(error.toJSON());
};

module.exports = {
  ApiError,
  errorHandler,
};
