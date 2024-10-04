import { NonExistentIdError } from "../src/errors/NonExistentIdError";

export const expectNonExistentIdError = async (fn: () => Promise<any>) => {
  await expect(fn()).rejects.toThrow(NonExistentIdError);
};

export const expectError = async (
  fn: () => Promise<any>,
  errorType: new (...args: any[]) => Error
) => {
  await expect(fn()).rejects.toThrow(errorType);
};

