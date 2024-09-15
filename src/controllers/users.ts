import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import userHandler from "../handlers/userHandler";
import { User } from "../database/entity/User";
import Auth from "../middlewares/Auth";

const usersRouter = Router();
// router.get("/:userId", handler.getUser);
// router.get("/", handler.listUsers);
// router.get("/:userId", handler.getUser);
usersRouter.get("/", Auth, userHandler.get);
usersRouter.get("/:id", userHandler.getByID);
usersRouter.post(
  "/",
  validateBodyMiddleware(CreateUserDto),
  userHandler.create
);
usersRouter.delete("/:id", userHandler.deleteById);
usersRouter.put(
  "/:id",
  validateBodyMiddleware(UpdateUserDto),
  userHandler.update
);

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default usersRouter;
