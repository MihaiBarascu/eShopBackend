import { hash } from "bcrypt";

const saltRoundsEnv = Number(process.env.SALT_ROUNDS);
const saltRounds =
  isNaN(saltRoundsEnv) || saltRoundsEnv <= 0 ? 10 : saltRoundsEnv;

export async function hashPassword(myPlaintextPassword: string) {
  return hash(myPlaintextPassword, saltRounds);
}
