import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { CreateRoleDto, UpdateRoleDto } from "../dto/role.dto";
import { RoleController } from "../controllers/RoleController";

import { CustomRequest } from "../interfaces";
import { RoleService } from "../services/RoleService";

import { validateFields } from "../shared/utils";

class RoleHandler {
  private roleController: RoleController;
  private roleService: RoleService;

  constructor() {
    this.roleController = new RoleController();
    this.roleService = new RoleService();
  }

  createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(CreateRoleDto, req.body);

      const result = await this.roleController.create(dto);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = Number(req.params.roleId);
      if (!roleId) {
        return res
          .status(400)
          .json({ message: "roleId param is invalid or undefined" });
      }

      const roleDto = plainToInstance(UpdateRoleDto, req.body);
      const result = await this.roleController.updateRole(roleId, roleDto);

      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  };

  getRoleList = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res.json(
        await this.roleController.listRoles(
          req.pagination?.offset,
          req.pagination?.limit
        )
      );
    } catch (error) {
      next(error);
    }
  };

  getRoleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = Number(req.params.roleId);
      if (!roleId) {
        return res
          .status(400)
          .json({ message: "roleId param is invalid or undefined" });
      }

      return res
        .status(200)
        .json(await this.roleController.getRoleById(roleId));
    } catch (error) {
      next(error);
    }
  };

  addPermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateFields(req, {
        params: { roleId: "roleId" },
        body: { permissionId: "permissionId" },
      });

      const roleId = Number(req.params.roleId);
      const permissionId = Number(req.body.permissionId);

      return res.json(
        await this.roleController.addPermission(roleId, permissionId)
      );
    } catch (error) {
      next(error);
    }
  };

  removePermission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      validateFields(req, {
        params: { roleId: "roleId", permissionId: "permissionId" },
      });

      const roleId = Number(req.params.roleId);
      const permissionId = Number(req.params.permissionId);

      return res.json(
        await this.roleController.removePermission(roleId, permissionId)
      );
    } catch (error) {
      next(error);
    }
  };
}

const roleHandler = new RoleHandler();
export default roleHandler;
