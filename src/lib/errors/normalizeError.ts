import { Prisma } from "@/generated/prisma/client";
import { ZodError } from "zod";

import { AppError } from "./app-error";

import { Errors } from "./errors";
import { ErrorResource } from "./errors-resource";

export function normalizeError(
  error: unknown,
  resource: ErrorResource = ErrorResource.SYSTEM,
): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return Errors.validation("Invalid input.", resource);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return Errors.conflict(
          "A record with this value already exists.",
          resource,
        );

      case "P2025":
        return Errors.notFound(
          "The requested resource was not found.",
          resource,
        );

      default:
        return Errors.internal("A database error occurred.", resource);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return Errors.internal("A database validation error occurred.", resource);
  }

  return Errors.internal("Something went wrong. Please try again.", resource);
}
