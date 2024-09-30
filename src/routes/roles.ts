import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateRoleDto, UpdateRoleDto } from "../dto/role.dto";
import roleHandler from "../handlers/roleHandler";
const rolesRouter = Router();
// router.get("/:userId", handler.getUser);
// router.get("/", handler.listUsers);
// router.get("/:userId", handler.getUser);
rolesRouter.get("/", roleHandler.getRoleList);
rolesRouter.get("/:roleId", roleHandler.getRoleById);

rolesRouter.delete(
  "/:roleId/permissions/:permissionId",
  roleHandler.removePermission
);

rolesRouter.post("/:roleId/permissions", roleHandler.addPermission);

rolesRouter.post(
  "/",
  validateBodyMiddleware(CreateRoleDto),
  roleHandler.createRole
);

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default rolesRouter;
