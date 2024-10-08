import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export function validateBodyMiddleware<T extends object>(type: new () => T) {
  return async (request: Request, response: Response, next: NextFunction) => {
    const instance = plainToInstance(type, request.body);
    const validationOptions = { forbidNonWhitelisted: true, whitelist: true };
    const errors = await validate(instance, validationOptions);
    if (errors.length > 0) {
      return response.status(400).json({ errors });
    }

    request.body = instance;
    next();
  };
}
