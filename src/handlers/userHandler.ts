import e, { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import { User } from "../database/entity/User";
import { hashPassword } from "../utils/hashPassword";
import { Role } from "../database/entity/Role";
import { In } from "typeorm";

const get = shared.get(User);
const deleteById = shared.deleteById(User);

const getByID = shared.getByID(User);

const createUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const repository = AppDataSource.getRepository(User);
    const roleRepository = AppDataSource.getRepository(Role);

    const { firstName, lastName, email, password, roles } = request.body;
    const user = new User();

    if (roles.length && roles) {
      const foundRoles = await roleRepository.findBy({
        id: In(roles),
      });
      if (foundRoles.length !== roles.length) {
        return response.status(400).send("Invalid roles");
      }
      user.roles = foundRoles;
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = await hashPassword(password);

    const result = await repository.save(user);
    if (result) {
      response.status(201).json(result);
    }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const roleRepository = AppDataSource.getRepository(Role);
    const user = request.body;

    const userToUpdate = await userRepository.findOneBy({
      id: Number(request.params.id),
    });
    if (!userToUpdate) {
      return response.status(404).json({ message: "User not found" });
    }

    userToUpdate.firstName = user.firstName || userToUpdate.firstName;
    userToUpdate.lastName = user.lastName || userToUpdate.lastName;
    userToUpdate.email = user.email || userToUpdate.email;
    userToUpdate.roles = user.roles;

    if (user.password) {
      userToUpdate.password = await hashPassword(user.password);
    }

    if (user.roles && user.roles.length) {
      const foundRoles = await roleRepository.findBy({
        id: In(user.roles),
      });
      if (foundRoles.length !== user.roles.length) {
        return response.status(400).send("Invalid roles");
      }
      userToUpdate.roles = foundRoles;
    }

    const result = await userRepository.save(userToUpdate);

    return response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default { createUser, get, getByID, updateUser, deleteById };
