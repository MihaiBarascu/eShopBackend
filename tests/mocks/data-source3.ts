import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
  entities: ["../../src/database/entity/**/*.{js,ts}"],
});

AppDataSource.initialize()
  .then(() => {
    console.info("Data Source has been initialized");
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });

