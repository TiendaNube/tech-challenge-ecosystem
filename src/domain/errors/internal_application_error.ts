import { CustomError } from "./custom_error";

export class InternalApplicationError extends CustomError {
  constructor(message: string) {
    super(message);
  }
}
