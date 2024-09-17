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
export const JWT_SECRET = process.env.JWT_SECRET || "s3cretP3ntru7jwt!";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
export const MAX_FILE_SIZE =
  Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;
