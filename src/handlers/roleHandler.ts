import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import { Role } from "../database/entity/Role";
import { Permission } from "../database/entity/Permission";
import { In } from "typeorm";

const get = shared.get(Role);
const deleteById = shared.deleteById(Role);
const getByID = shared.getByID(Role);
const create = shared.create(Role);
const update = shared.update(Role);

const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleRepository = AppDataSource.getRepository(Role);

    const permissionRepository = AppDataSource.getRepository(Permission);

    const role = req.body;

    if (role.permissions) {
      const permissions = await permissionRepository.findBy({
        id: In(role.permissions),
      });

      if (permissions.length !== req.body.permissions.length) {
        return res.status(400).send("Invalid permissions");
      }

      role.permissions = permissions;
    }
    const result = await roleRepository.save(plainToInstance(Role, role));

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleRepository = AppDataSource.getRepository(Role);

    const permissionRepository = AppDataSource.getRepository(Permission);

    const role = await roleRepository.findOneBy({ id: Number(req.params.id) });

    if (!role) {
      return res.status(404).send(`Role with id ${req.params.id} not found`);
    }

    const { name, permissions, description } = req.body;

    const foundPermissions = await permissionRepository.findBy({
      id: In(permissions),
    });

    if (foundPermissions.length !== permissions.length) {
      return res.status(400).send("Invalid permissions");
    }

    role.permissions = foundPermissions;
    role.name = name ?? role.name;
    role.description = description ?? role.description;

    const result = await roleRepository.save(role);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  updateRole,
  createRole,
  create,
  get,
  getByID,
  update,
  deleteById,
};

