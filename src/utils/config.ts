import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

export const MAX_RETRIES = process.env.MAX_RETRIES!;
export const RETRY_DELAY = process.env.RETRY_DELAY!;

export const PORT = process.env.APP_PORT!;
export const DB_CONNECTION = process.env.DB_CONNECTION!;
export const DB_HOST = process.env.DB_HOST!;
export const DB_PORT = process.env.DB_PORT!;
export const DB_USERNAME = process.env.DB_USERNAME!;
export const DB_PASSWORD = process.env.DB_PASSWORD!;
export const DB_DATABASE = process.env.DB_DATABASE!;
export const DB_ENTITIES = process.env.DB_ENTITIES!;
export const DB_MIGRATIONS = process.env.DB_MIGRATIONS!;
export const DB_CLI_MIGRATIONS_DIR = process.env.DB_CLI_MIGRATIONS_DIR!;
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS)!;
export const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE)!;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
if (!ACCESS_TOKEN_SECRET) throw new Error("undefined access token secret");
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
if (!REFRESH_TOKEN_SECRET) throw new Error("undefined refresh token secret");

export const PASSWORD_RESET_TOKEN_SECRET =
  process.env.PASSWORD_RESET_TOKEN_SECRET;
if (!PASSWORD_RESET_TOKEN_SECRET)
  throw new Error("undefined password reset token secret");

export const ROLES_LIST = {
  Admin: 1,
  User: 3,
  Editor: 4,
};
