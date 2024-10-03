export class InvalidNumberError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "InvalidNumberError";
    this.status = 400;
  }
}

