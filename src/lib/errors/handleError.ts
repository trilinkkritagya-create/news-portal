import { AppError } from "./app-error";
import { ErrorCode } from "./errors-code";
import { ErrorResource } from "./errors-resource";

export type ErrorResponse = {
  code: ErrorCode;
  message: string;
  resource: ErrorResource;
};

export function handleError(error: AppError): ErrorResponse {
  return {
    code: error.code,
    message: error.message,
    resource: error.resource,
  };
}
