import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";

function create<T extends object>(type: new () => T) {
  return async (request: Request, response: Response) => {
    try {
      const userRepository = AppDataSource.getRepository(type);
      const entity = plainToInstance(type, request.body);

      await userRepository.save(entity);
      response.status(201).json(entity);
    } catch (error) {
      response.status(500).json({ error });
    }
  };
}

function get<T extends object>(type: new () => T) {
  return async (request: Request, response: Response) => {
    try {
      const users = await AppDataSource.getRepository(type).find();
      response.json(users);
    } catch (error) {
      response.status(500).json({ message: "Error getting users", error });
    }
  };
}

export default { create, get };
