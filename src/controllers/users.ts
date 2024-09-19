import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import userHandler from "../handlers/userHandler";
import verifyJWT from "../middlewares/verifyAccessTokenMiddleware";
import { verifyRoles } from "../middlewares/verifyRolesMiddleware";
import { ROLES_LIST } from "../utils/config";

const usersRouter = Router();

usersRouter.use(verifyJWT);

usersRouter.get(
  "/",
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
  userHandler.get
);

// router.get("/:userId", handler.getUser);
// router.get("/", handler.listUsers);
// router.get("/:userId", handler.getUser);
// usersRouter.get("/", userHandler.get);
usersRouter.get("/:id", userHandler.getByID);
usersRouter.post(
  "/",
  validateBodyMiddleware(CreateUserDto),
  userHandler.createUser
);

usersRouter.delete("/:id", userHandler.deleteById);
usersRouter.put(
  "/:id",
  validateBodyMiddleware(UpdateUserDto),
  userHandler.updateUser
);

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default usersRouter;
