import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import userHandler from "../handlers/userHandler";
import verifyJWT from "../middlewares/verifyAccessTokenMiddleware";
import { verifyRoles } from "../middlewares/verifyRolesMiddleware";
import { ROLES_LIST } from "../utils/config";
import { listOrders } from "../handlers/userOrdersHandler";

const usersRouter = Router();
usersRouter.put(
  "/:id",
  validateBodyMiddleware(UpdateUserDto),
  userHandler.updateUser
);
usersRouter.use(verifyJWT);
usersRouter.get("/", verifyRoles(ROLES_LIST.Admin), userHandler.get);
usersRouter.get("/:id", userHandler.getByID);
usersRouter.post(
  "/",
  validateBodyMiddleware(CreateUserDto),
  userHandler.createUser
);

usersRouter.delete("/:id", userHandler.deleteById);

usersRouter.get("/:userId/orders", listOrders);

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default usersRouter;
