import express, { Express, Request, Response } from "express";

import usersRouter from "./routes/users";

import productsRouter from "./routes/products";
import categoriesRouter from "./routes/categories";
import ordersRouter from "./routes/orders";
import orderProductsRouter from "./routes/orderProducts";
import authRouter from "./routes/auth";
import rolesRouter from "./routes/roles";
import permissionsRouter from "./routes/permissions";
import { pagination } from "./middlewares/paginationMiddleware";
import cookieParser from "cookie-parser";

import morgan from "morgan";
import registerRouter from "./routes/register";
import imagesRouter from "./routes/images";
import { Router } from "express";

const app: Express = express();

const appRouter = Router();

appRouter.use(express.json());

appRouter.use(cookieParser());

appRouter.use(morgan("dev"));

appRouter.use(pagination);

appRouter.use("/register", registerRouter);
appRouter.use("/auth", authRouter);

appRouter.use("/users", usersRouter);
appRouter.use("/products", productsRouter);
appRouter.use("/categories", categoriesRouter);
appRouter.use("/orders", ordersRouter);
appRouter.use("/order-products", orderProductsRouter);
appRouter.use("/roles", rolesRouter);
appRouter.use("/permissions", permissionsRouter);
appRouter.use("/images", imagesRouter);
app.use("/api/v1", appRouter);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

export default app;
