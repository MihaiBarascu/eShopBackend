export class InvalidTokenError extends Error {
  status: number;

  constructor(message: string = "Invalid token") {
    super(message);
    this.name = "InvalidTokenError";
    this.status = 401;
  }
}
