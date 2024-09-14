import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import {
  CreateOrderProductsDto,
  UpdateOrderProductsDto,
} from "../dto/orderProducts.dto";
import userHandler from "../handlers/userHandler";
import Product from "../database/entity/Product";
import orderProductsHandler from "../handlers/orderProductsHandler";
const orderProductsRouter = Router();
// router.get("/:userId", handler.getUser);
// router.get("/", handler.listUsers);
// router.get("/:userId", handler.getUser);
orderProductsRouter.get("/", orderProductsHandler.get);
orderProductsRouter.get("/:id", orderProductsHandler.getByID);
orderProductsRouter.post(
  "/",
  validateBodyMiddleware(CreateOrderProductsDto),
  orderProductsHandler.createOrderProducts
);
orderProductsRouter.delete("/:id", orderProductsHandler.deleteById);
orderProductsRouter.put(
  "/:id",
  validateBodyMiddleware(UpdateOrderProductsDto),
  orderProductsHandler.updateOrderProduct
);

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default orderProductsRouter;

