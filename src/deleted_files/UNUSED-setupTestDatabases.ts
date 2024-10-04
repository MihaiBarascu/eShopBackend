// import { DataSource } from "typeorm";
// import { info, error as logError } from "../../src/utils/logger";
// import path from "path";

// export const setupTestDatabases = async () => {
//   const AppDataSource = new DataSource({
//     type: "mysql",
//     host: "127.0.0.1",
//     port: 3309,
//     username: "root",
//     password: "root",
//     database: "eShopTest",
//     // migrations: ["../../src/database/migration/**/*.{js,ts}"],
//     logging: false,
//     // entities: [path.join(__dirname, "../../src/database/entity/**/*.{js,ts}")],
//     // synchronize: true,
//     subscribers: [],
//   });

//   await AppDataSource.initialize();

//   const workers = parseInt(process.env.JEST_WORKERS || "1");

//   for (let i = 1; i <= workers; i++) {
//     const workerDatabaseName = `eShopTest_${i}`;

//     await AppDataSource.query(`DROP DATABASE IF EXISTS ${workerDatabaseName}`);
//     await AppDataSource.query(`CREATE DATABASE ${workerDatabaseName}`);
//   }

//   await AppDataSource.destroy();
// };

// setupTestDatabases();

