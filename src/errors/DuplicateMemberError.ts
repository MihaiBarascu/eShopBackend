export class DuplicateMemberError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "DuplicateMemberError";
    this.status = 404;
  }
}

