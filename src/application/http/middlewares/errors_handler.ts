import { Request, Response, NextFunction } from "express";
import { DatabaseError } from "../../../domain/errors/database_error";
import { InternalApplicationError } from "../../../domain/errors/internal_application_error";
import { ValidationError } from "../../../domain/errors/validation_error";

const errorsMapping = new Map<any, number>([
  [ValidationError, 400],
  [DatabaseError, 500],
]);

export function requestErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  for (let [errorType, httpStatusCode] of errorsMapping) {
    if (error instanceof errorType) {
      res.status(httpStatusCode).json(error.details());
      return next();
    }
  }

  const internalError = new InternalApplicationError(
    "unexpected error occurred, please try again later."
  );
  res.status(500).json(internalError.details());
  next();
}
