export class CustomError extends Error {
  public readonly errorType: string;
  public readonly payload: string;
  constructor(message: string, errorType: string) {
    super(message ? message : '');
    this.errorType = errorType;
  }
}
