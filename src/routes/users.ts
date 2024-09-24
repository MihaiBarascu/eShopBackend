import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import userHandler from "../handlers/userHandler";
import verifyJWT from "../middlewares/verifyAccessTokenMiddleware";
import { verifyRoles } from "../middlewares/verifyRolesMiddleware";
import { ROLES_LIST } from "../utils/config";
import { verifyUuidParamMiddleware } from "../middlewares/verifyUserIdParamMiddleware";
import { CreateUserOrderDto } from "../dto/userOrder.dto";

const usersRouter = Router();

usersRouter.get("/", userHandler.getUsersList);
usersRouter.post("/:uuid/orders", userHandler.createOrder);
usersRouter.get("/:uuid/orders", userHandler.listOrders);
usersRouter.post("/", userHandler.createUser);
usersRouter.put("/:uuid", userHandler.updateUser);
usersRouter.post("/:uuid/roles", userHandler.addUserRole);
usersRouter.delete("/:uuid/roles/:roleId", userHandler.removeUserRole);

// usersRouter.use(verifyJWT);

// usersRouter.param("uuid", verifyUuidParamMiddleware);
// usersRouter.get("/:uuid", userHandler.getUserByUuid);

// usersRouter.post("/:uuid/roles", userHandler.addUserRole);
// usersRouter.delete("/:uuid/roles/:roleId", userHandler.removeUserRole);

// usersRouter.delete("/:userId", userHandler.deleteUserById);
// usersRouter.get("/:userId/orders", userHandler.listOrders);
// usersRouter.post(
//   "/:userId/orders",
//   validateBodyMiddleware(CreateUserOrderDto),
//   userHandler.createOrderByUserId
// );

// usersRouter.use(verifyRoles(ROLES_LIST.Admin));

// usersRouter.get("/", userHandler.getUsersList);

// // usersRouter.put(
// //   "/:id",
// //   validateBodyMiddleware(UpdateUserDto),
// //   userHandler.updateUser
// // );

// usersRouter.get("/", userHandler.getUsersList);
// usersRouter.post(
//   "/",
//   validateBodyMiddleware(CreateUserDto),
//   userHandler.createUser
// );

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default usersRouter;
