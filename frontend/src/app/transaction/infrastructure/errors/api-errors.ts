export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorName?: string,
    public errors?: any,
    public timestamp?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(errorResponse: any, statusCode: number): ApiError {
    return new ApiError(
      errorResponse.message || 'Unknown API error',
      statusCode,
      errorResponse.name,
      errorResponse.errors,
      errorResponse.timestamp
    );
  }
}
