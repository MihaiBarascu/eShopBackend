import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { LoginDto } from "../dto/login.dto";
import userHandler from "../handlers/userHandler";
import Product from "../database/entity/Product";
import authHandler from "../handlers/authHandler";
const authRouter = Router();
// router.get("/:userId", handler.getUser);
// router.get("/", handler.listUsers);
// router.get("/:userId", handler.getUser);
// categoriesRouter.get("/", categoryHandler.get);
// categoriesRouter.get("/:id", categoryHandler.getByID);
authRouter.post("/", validateBodyMiddleware(LoginDto), authHandler);
// categoriesRouter.delete("/:id", categoryHandler.deleteById);
// categoriesRouter.put(
//   "/:id",
//   validateBodyMiddleware(UpdateCategoryDto),
//   categoryHandler.update
// );

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default authRouter;
