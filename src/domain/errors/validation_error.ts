import { CustomError } from "./custom_error";

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message);
  }
}
