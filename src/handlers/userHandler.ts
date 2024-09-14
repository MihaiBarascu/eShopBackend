import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import { User } from "../database/entity/User";
import { hashPassword } from "../utils/hashPassword";

const get = shared.get(User);
const deleteById = shared.deleteById(User);

const getByID = shared.getByID(User);

const create = async (request: Request, response: Response) => {
  try {
    const repository = AppDataSource.getRepository(User);
    const body = request.body;

    const entity = plainToInstance(User, body);
    entity.password = await hashPassword(body.password);

    await repository.save(entity);
    response.status(201).json(entity);
  } catch (error) {
    response.status(500).json({ error });
  }
};
const update = async (request: Request, response: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = request.body;

    const userToUpdate = await userRepository.findOneBy({
      id: Number(request.params.id),
    });

    console.log(userToUpdate);
    if (!userToUpdate) {
      return response.status(404).json({ message: "User not found" });
    }

    userToUpdate.firstName = user.firstName || userToUpdate.firstName;
    userToUpdate.lastName = user.lastName || userToUpdate.lastName;
    userToUpdate.email = user.email || userToUpdate.email;

    if (user.password) {
      userToUpdate.password = await hashPassword(user.password);
    }
    await userRepository.save(userToUpdate);

    response.status(201).json(user);
  } catch (error) {
    response.status(500).json({ error });
  }
};

export default { create, get, getByID, update, deleteById };
