type CustomErrorType = {
  errorType: string;
  message: string;
  timestamp: number;
};

export class CustomError extends Error {
  constructor(message: string) {
    super(message);
  }

  details(): CustomErrorType {
    return {
      errorType: this.constructor.name,
      message: this.message,
      timestamp: Date.now(),
    };
  }
}
