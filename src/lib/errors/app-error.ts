import { ErrorCode } from "./errors-code";
import { ErrorResource } from "./errors-resource";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly resource: ErrorResource;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    resource: ErrorResource,
  ) {
    super(message);

    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.resource = resource;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
