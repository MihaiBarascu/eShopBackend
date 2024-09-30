import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateOrderDto, UpdateOrderDto } from "../dto/order.dto";
import { CreateUserOrderDto } from "../dto/userOrder.dto";
import orderHandler from "../handlers/orderHandler";

const ordersRouter = Router();
// router.get("/:userId", handler.getUser);
// router.get("/", handler.listUsers);
// router.get("/:userId", handler.getUser);

ordersRouter.delete(
  "/:orderId/products/:productId",
  orderHandler.removeProductFromOrder
);

ordersRouter.post(
  "/:orderId/products",
  validateBodyMiddleware(CreateUserOrderDto),
  orderHandler.addProductsToOrder
);

ordersRouter.get("/", orderHandler.listOrders);
ordersRouter.get("/:orderId", orderHandler.getOrder);
ordersRouter.post(
  "/",
  validateBodyMiddleware(CreateOrderDto),
  orderHandler.createOrder
);
ordersRouter.delete("/:orderId", orderHandler.deleteOrder);
ordersRouter.put(
  "/:orderId",
  validateBodyMiddleware(UpdateOrderDto),
  orderHandler.updateOrder
);

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default ordersRouter;
