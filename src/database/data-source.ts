import * as dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  username: "root",
  password: "root",
  database: "eShop",
  migrations: ["src/database/migrations/*.{js,ts}"],
  logging: process.env.ORM_LOGGING === "true",
  entities: ["src/database/entity/**/*.{js,ts}"],
  synchronize: true,
  subscribers: [],
});
