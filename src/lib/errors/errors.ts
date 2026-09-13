import { AppError } from "./app-error";
import { ErrorCode } from "./errors-code";
import { ErrorResource } from "./errors-resource";

export const Errors = {
  validation(
    message = "Invalid input.",
    resource: ErrorResource = ErrorResource.SYSTEM,
  ) {
    return new AppError(message, ErrorCode.VALIDATION, 400, resource);
  },

  unauthorized(
    message = "Authentication is required.",
    resource: ErrorResource = ErrorResource.AUTH,
  ) {
    return new AppError(message, ErrorCode.UNAUTHORIZED, 401, resource);
  },

  forbidden(
    message = "You do not have permission to perform this action.",
    resource: ErrorResource = ErrorResource.SYSTEM,
  ) {
    return new AppError(message, ErrorCode.FORBIDDEN, 403, resource);
  },

  notFound(
    message = "The requested resource was not found.",
    resource: ErrorResource = ErrorResource.SYSTEM,
  ) {
    return new AppError(message, ErrorCode.NOT_FOUND, 404, resource);
  },

  conflict(
    message = "The requested operation conflicts with existing data.",
    resource: ErrorResource = ErrorResource.SYSTEM,
  ) {
    return new AppError(message, ErrorCode.CONFLICT, 409, resource);
  },

  badRequest(
    message = "The request is invalid.",
    resource: ErrorResource = ErrorResource.SYSTEM,
  ) {
    return new AppError(message, ErrorCode.BAD_REQUEST, 400, resource);
  },

  internal(
    message = "Something went wrong. Please try again.",
    resource: ErrorResource = ErrorResource.SYSTEM,
  ) {
    return new AppError(message, ErrorCode.INTERNAL, 500, resource);
  },
};
