import { DataSource } from "typeorm";
import { info, error as logError } from "../../src/utils/logger";
import path from "path";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: 3309,
  username: "root",
  password: "root",
  database: "eShopTest",
  migrations: ["../../src/database/migration/**/*.{js,ts}"],
  logging: false,
  entities: [path.join(__dirname, "../../src/database/entity/**/*.{js,ts}")],
  synchronize: true,
  subscribers: [],
  dropSchema: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("datasource initiazlied");
  })
  .catch((error) => {
    console.log("Error during Data Source initialization:", error);
  });

export async function clearAllTables() {
  if (!AppDataSource.isInitialized) {
    throw new Error("Data Source is not initialized");
  }

  const entities = AppDataSource.entityMetadatas;

  await AppDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);

  await Promise.all(
    entities.map(async (entity) => {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    })
  );

  await AppDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);

  console.log("All tables have been cleared");
}

// docker-compose -f docker-compose.test.yaml up -d
