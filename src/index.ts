import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { User } from "./database/entity/User";
import { AppDataSource } from "./database/data-source";
import { validateBodyMiddleware } from "./middlewares/validationMiddleware";
import bcrypt from "bcrypt";
import { hashPassword } from "./utils/hashPassword";
import { CreateUserDto } from "./dto/user.dto";
import usersRouter from "./controllers/users";
import { v4 } from "uuid";
const app: Express = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
