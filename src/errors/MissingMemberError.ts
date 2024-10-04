export class MissingMemberError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "MissingMemberError";
    this.status = 404;
  }
}

