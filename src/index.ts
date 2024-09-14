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
import productsRouter from "./controllers/products";
import categoriesRouter from "./controllers/categories";
import ordersRouter from "./controllers/orders";
import orderProductsRouter from "./controllers/orderProducts";
const app: Express = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/orders", ordersRouter);
app.use("/order-products", orderProductsRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
