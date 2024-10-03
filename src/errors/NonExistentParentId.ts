export class ForeignKeyConstraintError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "ForeignKeyConstraintError";
    this.status = 400;
  }
}
export class NonExistentParentIdError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "NonExistentParentIdError";
    this.status = 400;
  }
}
