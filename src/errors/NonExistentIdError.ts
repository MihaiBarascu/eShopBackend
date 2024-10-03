export class NonExistentIdError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "NonExistentIdError";
    this.status = 404;
  }
}

