export class AppError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "AppError";
  }
}

export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS",
  MARKET_CLOSED: "MARKET_CLOSED",
} as const;

export const Errors = {
  forbidden(message: string) {
    return new AppError(ErrorCodes.FORBIDDEN, message);
  },
  unauthorized(message: string) {
    return new AppError(ErrorCodes.UNAUTHORIZED, message);
  },
};