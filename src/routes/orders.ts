import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateOrderDto, UpdateOrderDto } from "../dto/order.dto";
import userHandler from "../handlers/userHandler";
import Product from "../database/entity/Product";
import orderHandler from "../handlers/orderHandler";

const ordersRouter = Router();
// router.get("/:userId", handler.getUser);
// router.get("/", handler.listUsers);
// router.get("/:userId", handler.getUser);
ordersRouter.get("/", orderHandler.get);
ordersRouter.get("/:id", orderHandler.getByID);
ordersRouter.post(
  "/",
  validateBodyMiddleware(CreateOrderDto),
  orderHandler.create
);
ordersRouter.delete("/:id", orderHandler.deleteById);
ordersRouter.put(
  "/:id",
  validateBodyMiddleware(UpdateOrderDto),
  orderHandler.update
);

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default ordersRouter;
