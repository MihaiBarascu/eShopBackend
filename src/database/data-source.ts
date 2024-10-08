import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { info, error as logError } from "../utils/logger";
import {
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_ENTITIES,
  DB_MIGRATIONS,
  MAX_RETRIES,
  RETRY_DELAY,
} from "../utils/config";

dotenv.config();
console.log(
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_ENTITIES,
  DB_MIGRATIONS,
  MAX_RETRIES
);
export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  migrations: [DB_MIGRATIONS],
  logging: process.env.ORM_LOGGING === "true",
  entities: [DB_ENTITIES],
  synchronize: true,
  subscribers: [],
});

async function initializeDataSource(
  retries: number = Number(MAX_RETRIES)
): Promise<void> {
  try {
    await AppDataSource.initialize();
    info("Data Source has been initialized");
  } catch (error) {
    if (retries > 0) {
      logError(
        `Error during Data Source initialization. Retries left: ${retries}. Error:`,
        error
      );
      setTimeout(() => initializeDataSource(retries - 1), Number(RETRY_DELAY));
    } else {
      logError(
        "Error during Data Source initialization. No retries left:",
        error
      );
    }
  }
}

initializeDataSource();
