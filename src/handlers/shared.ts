import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";
import { hash } from "bcrypt";

interface EntityWithID {
  id: number;
}

function create<T extends object>(type: new () => T) {
  return async (request: Request, response: Response) => {
    try {
      const repository = AppDataSource.getRepository(type);
      const body = request.body;

      const entity = plainToInstance(type, body);

      await repository.save(entity);
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

function deleteById<T extends object>(type: new () => T) {
  return async (request: Request, response: Response) => {
    try {
      const result = await AppDataSource.getRepository(type).delete(
        request.params.id
      );

      if (result.affected === 0) {
        return response.status(404).json({ message: "Id not found" });
      }
      response.status(200).end();
    } catch (error) {
      response.status(500).json({ error });
    }
  };
}
function getByID<T extends EntityWithID>(type: new () => T) {
  return async (request: Request, response: Response) => {
    try {
      const repository = AppDataSource.getRepository(type);
      const entity = await repository.findOneBy({
        id: Number(request.params.id) as any,
      });

      if (entity) {
        response.json(entity);
      } else {
        response.status(404).json({ message: `${type.name} not found` });
      }
    } catch (error) {
      response
        .status(500)
        .json({ message: `Error getting ${type.name}`, error });
    }
  };
}

function update<T extends EntityWithID>(type: new () => T) {
  return async (request: Request, response: Response) => {
    try {
      const repository = AppDataSource.getRepository(type);
      const entity = request.body;

      const entityToUpdate = await repository.findOneBy({
        id: Number(request.params.id),
      } as any);

      if (!entityToUpdate) {
        return response.status(404).json({ message: `${type.name} not found` });
      }

      for (const key in entity) {
        if (entity.hasOwnProperty(key) && key !== "id") {
          if (
            entity[key] !== undefined &&
            entity[key] !== null &&
            (typeof entity[key] !== "string" || entity[key].trim() !== "")
          ) {
            entityToUpdate[key] = entity[key];
          }
        }
      }

      await repository.save(entityToUpdate);

      response.status(201).json(entityToUpdate);
    } catch (error) {
      response.status(500).json({
        error: error,
      });
    }
  };
}
export default { create, get, deleteById, getByID, update };
