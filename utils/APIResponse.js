class ApiResponse {
  constructor(statusCode = 200, message = 'Success', data = null, meta = null) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }

  static success(
    data = null,
    message = 'Success',
    statusCode = 200,
    meta = null
  ) {
    return new ApiResponse(statusCode, message, data, meta);
  }

  static created(
    data = null,
    message = 'Resource created successfully',
    meta = null
  ) {
    return new ApiResponse(201, message, data, meta);
  }

  static noContent(message = 'No content') {
    return new ApiResponse(204, message, null, null);
  }

  toJSON() {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      meta: this.meta,
      timestamp: this.timestamp,
    };
  }
}

module.exports = {
  ApiResponse,
};
