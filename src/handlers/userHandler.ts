import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import { User } from "../database/entity/User";
import { hashPassword } from "../utils/hashPassword";
import { Role } from "../database/entity/Role";
import { In } from "typeorm";
import { extendedRequest } from "../utils/types";
import Order from "../database/entity/Order";
import OrderProducts from "../database/entity/OrderProducts";
import Product from "../database/entity/Product";
import {
  aggregateOrderProducts,
  findUserById,
  validateAndPrepareProducts,
  createNewOrder,
} from "../services/userOrderService";

import { transactionContext } from "../database/transactionContext";
import { error } from "console";
import { UserController } from "../controllers/user/UserController";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { CreateUserOrderDto } from "../dto/userOrder.dto";
import { plainToInstance } from "class-transformer";

const get = shared.get(User);
const deleteById = shared.deleteById(User);

const userController = new UserController();

const getUsersList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const offset = Number(req.query.offset) || undefined;
    const limit = Number(req.query.limit) || undefined;

    return res.json(await userController.listUsers(offset, limit));
  } catch (err) {
    next(err);
  }
};

const getUserByUuid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundUser = await userController.getUserByUuid(req.params.uuid);

    return res.json(foundUser);
  } catch (error) {
    next(error);
  }
};

const addUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleId = Number(req.body.roleToAdd);
    if (!roleId)
      return res
        .status(400)
        .json({ message: "roleToAdd field is missing from body" });

    const updatedUser = await userController.addRole(
      req.params.uuid,
      req.body.roleToAdd
    );

    const roles = updatedUser.roles.map((role) => role.name);

    return res.status(200).json({ updatedRoles: roles });
  } catch (error) {
    next(error);
  }
};

const removeUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roleId = Number(req.params.roleId);
    if (!roleId)
      return res.status(400).json({ message: "roleId param is missing" });

    const updatedUser = await userController.removeRole(
      req.params.uuid,
      roleId
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userUuid = req.params.uuid;
    const order: CreateUserOrderDto = req.body.userOrder;

    console.log(order);

    if (!order) {
      return res
        .status(400)
        .json({ message: "userOrder is missing for request body" });
    }

    const result = await userController.createOrder(userUuid, order);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const result = await AppDataSource.getRepository(User).delete(
      request.params.userId
    );

    if (result.affected === 0) {
      return response
        .status(404)
        .json({ message: `User with id${request.params.userId} not found` });
    }
    response
      .status(200)
      .json({ message: `User (${request.params.userId}) deleted` });
  } catch (error) {
    next(error);
  }
};

const getUserByID = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const repository = AppDataSource.getRepository(User);
    const foundUser = await repository.findOneBy({
      id: Number(request.params.userId),
    });

    if (foundUser) {
      response.json(foundUser);
    } else {
      response
        .status(404)
        .json({ message: `User with id ${request.params.userId} not found` });
    }
  } catch (error) {
    next(error);
  }
};

const createUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = request.body;
    const user = new CreateUserDto();

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;

    await userController.createUser(user);

    const userDetails = { firstName, lastName, email, password: "******" };

    return response.status(200).json(userDetails);
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
    const user: UpdateUserDto = request.body;
    const uuid = request.params.uuid;

    const updatedUser = await userController.updateUser(uuid, user);

    const { firstName, lastName, email } = updatedUser;

    const userDetails = { firstName, lastName, email };

    return response.status(200).json(userDetails);
  } catch (error) {
    next(error);
  }
};

const listOrders = async (
  req: extendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const uuid = req.params.uuid;
    const offset = Number(req.query.offset) || undefined;
    const limit = Number(req.query.limit) || undefined;

    return res
      .status(200)
      .json(await userController.listOrders(uuid, offset, limit));
  } catch (error) {
    next(error);
  }
};

export default {
  createUser,
  get,
  getUserByUuid,
  getUserByID,
  addUserRole,
  deleteById,
  listOrders,
  deleteUserById,
  getUsersList,
  removeUserRole,
  createOrder,
  updateUser,
};

//byuid
//teste la toate enitatile
//controllerul nu stie de request response da doar raspunusl la handler
// unic id in rute
//teste pe controllerele
