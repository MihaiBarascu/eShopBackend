import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateRoleDto, UpdateRoleDto } from "../dto/role.dto";
import roleHandler from "../handlers/roleHandler";
const rolesRouter = Router();
// router.get("/:userId", handler.getUser);
// router.get("/", handler.listUsers);
// router.get("/:userId", handler.getUser);
rolesRouter.get("/", roleHandler.get);
rolesRouter.get("/:id", roleHandler.getByID);
rolesRouter.post(
  "/",
  validateBodyMiddleware(CreateRoleDto),
  roleHandler.createRole
);
rolesRouter.delete("/:id", roleHandler.deleteById);
rolesRouter.put(
  "/:id",
  validateBodyMiddleware(UpdateRoleDto),
  roleHandler.updateRole
);

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default rolesRouter;
