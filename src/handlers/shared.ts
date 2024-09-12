import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";

function create<T extends object>(type: new () => T) {
  return async (request: Request, response: Response) => {
    try {
      const repostiry = AppDataSource.getRepository(type);
      const data = request.body;
      await repostiry.save(data);
      response.status(201).json(data);
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
