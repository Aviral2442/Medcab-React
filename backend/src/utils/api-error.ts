export class ApiError extends Error {
  status: number;

  constructor(status = 400, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
