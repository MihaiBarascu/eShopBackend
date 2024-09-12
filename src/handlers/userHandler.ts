import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import { User } from "../database/entity/User";
import { hashPassword } from "../utils/hashPassword";

const get = shared.get(User);

const getByID = async (request: Request, response: Response) => {
  try {
    const user = await AppDataSource.getRepository(User).findOneBy({
      id: Number(request.params.userId),
    });

    if (user) {
      response.json(user);
    } else {
      response.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    response.status(500).json({ message: "Error getting user", error });
  }
};

const create = async (request, response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = request.body;

    user.password = await hashPassword(user.password);

    await userRepository.save(user);
    response.status(201).json(user);
  } catch (error) {
    response.status(500).json({ error });
  }
};

const update = async (request, response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = request.body;

    user.password = await hashPassword(user.password);

    let userToUpdate = await userRepository.findOneBy({
      id: Number(user.id),
    });

    userToUpdate = { ...user };
    userRepository.update(Number(user.id), userToUpdate!);

    response.status(201).json(user);
  } catch (error) {
    response.status(500).json({ error });
  }
};

export default { create, get, getByID, update };
