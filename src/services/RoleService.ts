import { Role } from "../database/entity/Role";
import { UpdateRoleDto, CreateRoleDto } from "../dto/role.dto";
import { AppDataSource } from "../database/data-source";
import { PaginationResponse } from "../interfaces";
import {
  get,
  getById,
  simpleCreate,
  deleteById,
  restoreById,
} from "../shared/repositoryMethods";

import { Permission } from "../database/entity/Permission";

import { error as logError } from "../utils/logger";
import findOneOrFailTreated from "../shared/treatedFindOneOrFailMethod";

export class RoleService {
  constructor() {}

  async listRoles(
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Role>> {
    return await get(Role, undefined, undefined, offset, limit);
  }

  async getRoleById(id: number): Promise<Role> {
    return await getById(Role, id);
  }

  async create(dto: CreateRoleDto) {
    return await simpleCreate(Role, dto);
  }

  async updateRole(roleId: number, roleDto: UpdateRoleDto) {
    const roleRep = AppDataSource.getRepository(Role);

    const foundRole = await findOneOrFailTreated(roleRep, roleId);

    foundRole.name = roleDto.name || foundRole.name;
    foundRole.description = roleDto.description || foundRole.description;

    return await roleRep.save(foundRole);
  }

  async deleteRoleById(roleId: number) {
    return await deleteById<Role>(Role, roleId);
  }

  async restoreRoleById(roleId: number) {
    return await restoreById<Role>(Role, roleId);
  }

  async removePermission(roleId: number, permissionId: number) {
    const roleRepo = AppDataSource.getRepository(Role);
    const foundRole = await roleRepo.findOneOrFail({
      where: { id: roleId },
      relations: { permissions: true },
    });

    const permissionIndex = foundRole.permissions?.findIndex(
      (permission) => permission.id === permissionId
    );
    if (permissionIndex === -1) {
      logError(
        `error removing permission from role: role with id ${roleId} does not have permission with id ${permissionId}`
      );
      throw new Error("Permission not found in role");
    }

    foundRole.permissions.splice(permissionIndex, 1);

    return await roleRepo.save(foundRole);
  }

  async addPermission(roleId: number, permissionId: number) {
    const roleRepo = AppDataSource.getRepository(Role);

    const foundRole = await roleRepo.findOneOrFail({
      where: { id: roleId },
      relations: { permissions: true },
    });

    const permissionRepo = AppDataSource.getRepository(Permission);
    const foundPermission = await permissionRepo.findOneOrFail({
      where: { id: permissionId },
    });

    const alreadyHasPermission = foundRole.permissions?.findIndex(
      (permission) => permission.id === foundPermission.id
    );
    if (alreadyHasPermission !== -1) {
      logError(
        `error adding permission to role: role with id ${roleId} already has permission with id ${permissionId}`
      );
      throw new Error("Duplicate Permission");
    }

    foundRole.permissions.push(foundPermission);

    return await roleRepo.save(foundRole);
  }
}

