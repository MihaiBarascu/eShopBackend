import { Router } from "express";
import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from "../dto/permission.dto";
import permissionHandler from "../handlers/permissionHandler";

const permissionsRouter = Router();

permissionsRouter.get("/", permissionHandler.get);
permissionsRouter.get("/:id", permissionHandler.getByID);
permissionsRouter.post(
  "/",
  validateBodyMiddleware(CreatePermissionDto),
  permissionHandler.create
);
permissionsRouter.delete("/:id", permissionHandler.deleteById);
permissionsRouter.put(
  "/:id",
  validateBodyMiddleware(UpdatePermissionDto),
  permissionHandler.update
);

export default permissionsRouter;
