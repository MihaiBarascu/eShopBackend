import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.APP_PORT || 3000;
export const DB_CONNECTION = process.env.DB_CONNECTION || "mysql";
export const DB_HOST = process.env.DB_HOST || "mysql";
export const DB_PORT = process.env.DB_PORT || 3306;
export const DB_USERNAME = process.env.DB_USERNAME || "eShop";
export const DB_PASSWORD = process.env.DB_PASSWORD || "eShop";
export const DB_DATABASE = process.env.DB_DATABASE || "eShop";
export const DB_ENTITIES = process.env.DB_ENTITIES || "src/entity/**/*.ts";
export const DB_MIGRATIONS =
  process.env.DB_MIGRATIONS || "src/migration/**/*.ts";
export const DB_CLI_MIGRATIONS_DIR =
  process.env.DB_CLI_MIGRATIONS_DIR || "src/migration";
export const SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
export const MAX_FILE_SIZE =
  Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
if (!ACCESS_TOKEN_SECRET) throw new Error("undefined access token secret");
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
if (!REFRESH_TOKEN_SECRET) throw new Error("undefined refresh token secret");

export const ROLES_LIST = {
  Admin: 2,
  User: 3,
  Editor: 4,
};
