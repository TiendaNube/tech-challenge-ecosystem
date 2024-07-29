import { CustomError } from "./custom_error";

export class CacheError extends CustomError {
  constructor(message: string) {
    super(message);
  }
}
