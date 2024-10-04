// import { DataSource } from "typeorm";
// import path from "path";

// const createAppDataSource = (dbName: string): DataSource => {
//   return new DataSource({
//     type: "mysql",
//     host: process.env.DATABASE_HOST || "127.0.0.1",
//     port: parseInt(process.env.DATABASE_PORT || "3309"),
//     username: process.env.DATABASE_USER || "root",
//     password: process.env.DATABASE_PASSWORD || "root",
//     database: dbName,
//     logging: false,
//     entities: [path.join(__dirname, "../../src/database/entity/**/*.{js,ts}")],
//     synchronize: true,
//     dropSchema: true,
//   });
// };

// export default createAppDataSource;

