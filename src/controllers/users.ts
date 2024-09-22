import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import userHandler from "../handlers/userHandler";
import verifyJWT from "../middlewares/verifyAccessTokenMiddleware";
import { verifyRoles } from "../middlewares/verifyRolesMiddleware";
import { ROLES_LIST } from "../utils/config";
import { verifyUserIdParamMiddleware } from "../middlewares/verifyUserIdParamMiddleware";
import { CreateUserOrderDto } from "../dto/userOrder.dto";

const usersRouter = Router();
usersRouter.use(verifyJWT);

usersRouter.param("userId", verifyUserIdParamMiddleware);

usersRouter.get("/:userId", userHandler.getUserByID);
usersRouter.delete("/:userId", userHandler.deleteUserById);
usersRouter.get("/:userId/orders", userHandler.listOrders);
usersRouter.post(
  "/:userId/orders",
  validateBodyMiddleware(CreateUserOrderDto),
  userHandler.createOrderByUserId
);

usersRouter.use(verifyRoles(ROLES_LIST.Admin));
usersRouter.put(
  "/:id",
  validateBodyMiddleware(UpdateUserDto),
  userHandler.updateUser
);

usersRouter.get("/", userHandler.get);
usersRouter.post(
  "/",
  validateBodyMiddleware(CreateUserDto),
  userHandler.createUser
);

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default usersRouter;
