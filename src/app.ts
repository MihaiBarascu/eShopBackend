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
import refreshTokenRouter from "./routes/refresh";
import logoutRouter from "./routes/logout";
import morgan from "morgan";
import registerRouter from "./routes/register";
import imagesRouter from "./routes/images";

const app: Express = express();

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

app.use(pagination);

app.use("/register", registerRouter);
app.use("/auth", authRouter);
app.use("/refresh", refreshTokenRouter);
app.use("/logout", logoutRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/orders", ordersRouter);
app.use("/order-products", orderProductsRouter);
app.use("/roles", rolesRouter);
app.use("/permissions", permissionsRouter);
app.use("/images", imagesRouter);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

export default app;
