import bcrypt from "bcrypt";

const salt = process.env.HASH_SALT!;

export async function hashPassword(myPlaintextPassword: string) {
  return bcrypt.hash(myPlaintextPassword, salt);
}
