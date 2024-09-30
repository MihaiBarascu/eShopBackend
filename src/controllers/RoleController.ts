import { CreateRoleDto, UpdateRoleDto } from "../dto/role.dto";
import { RoleService } from "../services/RoleService";
import { PaginationResponse } from "../interfaces";
import { Role } from "../database/entity/Role";

export class RoleController {
  name: string;
  roleService: RoleService;

  constructor() {
    this.name = "RoleController";
    this.roleService = new RoleService();
  }

  listRoles = async (
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Role>> => {
    return await this.roleService.listRoles(offset, limit);
  };

  getRoleById = async (id: number): Promise<Role> => {
    return await this.roleService.getRoleById(id);
  };

  create = async (dto: CreateRoleDto) => {
    return await this.roleService.create(dto);
  };

  updateRole = async (roleId: number, roleDto: UpdateRoleDto) => {
    return await this.roleService.updateRole(roleId, roleDto);
  };

  deleteRoleById = async (roleId: number) => {
    return await this.roleService.deleteRoleById(roleId);
  };

  restoreRoleById = async (roleId: number) => {
    return await this.roleService.restoreRoleById(roleId);
  };

  addPermission = async (roleId: number, permissionId: number) => {
    return await this.roleService.addPermission(roleId, permissionId);
  };

  removePermission = async (roleId: number, permissionId: number) => {
    return await this.roleService.removePermission(roleId, permissionId);
  };
}

