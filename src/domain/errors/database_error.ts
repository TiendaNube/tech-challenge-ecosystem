import { CustomError } from "./custom_error";

export class DatabaseError extends CustomError {
  constructor(message: string) {
    super(message);
  }
}
