import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";

import { User } from "../database/entity/User";
import { hashPassword } from "../utils/hashPassword";

export const registerHandler = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const repository = AppDataSource.getRepository(User);
    const { firstName, lastName, email, password } = request.body;
    const user = new User();

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

