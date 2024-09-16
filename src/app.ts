import express, { Express, Request, Response } from "express";

import usersRouter from "./controllers/users";

import productsRouter from "./controllers/products";
import categoriesRouter from "./controllers/categories";
import ordersRouter from "./controllers/orders";
import orderProductsRouter from "./controllers/orderProducts";
import authRouter from "./controllers/auth";
import rolesRouter from "./controllers/roles";
import permissionsRouter from "./controllers/permissions";
import productImagesRouter from "./controllers/productImages";
const app: Express = express();

app.use(express.json());

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/orders", ordersRouter);
app.use("/order-products", orderProductsRouter);
app.use("/roles", rolesRouter);
app.use("/permissions", permissionsRouter);
app.use("/product-images", productImagesRouter);
app.use("/auth", authRouter);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

export default app;
