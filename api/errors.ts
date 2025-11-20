export interface ApiErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  stack?: string;
}

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTH = 'AUTH',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  SERVER = 'SERVER',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN',
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly data?: ApiErrorResponse;

  constructor(message: string, statusCode: number, data?: ApiErrorResponse) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.data = data;
    this.type = this.getErrorType(statusCode);
  }

  private getErrorType(statusCode: number): ErrorType {
    switch (statusCode) {
      case 400:
        return ErrorType.VALIDATION;
      case 401:
        return ErrorType.AUTH;
      case 403:
        return ErrorType.FORBIDDEN;
      case 404:
        return ErrorType.NOT_FOUND;
      case 409:
        return ErrorType.CONFLICT;
      case 429:
        return ErrorType.RATE_LIMIT;
      case 500:
      case 502:
      case 503:
        return ErrorType.SERVER;
      case 0:
        return ErrorType.NETWORK;
      default:
        return ErrorType.UNKNOWN;
    }
  }

  getUserMessage(): string {
    if (this.type === ErrorType.VALIDATION && Array.isArray(this.data?.message)) {
      return this.data.message.join('\n');
    }

    const userMessages: Record<ErrorType, string> = {
      [ErrorType.VALIDATION]: this.message,
      [ErrorType.AUTH]: 'Session expired. Please login again.',
      [ErrorType.FORBIDDEN]: "You don't have permission to perform this action.",
      [ErrorType.NOT_FOUND]: 'Resource not found.',
      [ErrorType.CONFLICT]: this.message,
      [ErrorType.RATE_LIMIT]: 'Too many requests. Please wait and try again.',
      [ErrorType.SERVER]: 'Something went wrong. Please try again later.',
      [ErrorType.NETWORK]: 'No internet connection. Please check your network.',
      [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.',
    };

    return userMessages[this.type];
  }

  getValidationErrors(): string[] {
    if (this.type === ErrorType.VALIDATION && Array.isArray(this.data?.message)) {
      return this.data.message;
    }
    return [];
  }

  shouldClearAuth(): boolean {
    return this.type === ErrorType.AUTH;
  }

  shouldRetry(): boolean {
    return this.type === ErrorType.RATE_LIMIT;
  }
}
