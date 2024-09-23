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

const get = shared.get(User);
const deleteById = shared.deleteById(User);

const userController = new UserController();

const testUsersList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    console.log(
      await userController.deleteUserByEmail("maria.ionescu@gmail.com")
    );
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

const createOrderByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await transactionContext(async (transactionManager) => {
      const userRepository = transactionManager.getRepository(User);
      const productRepository = transactionManager.getRepository(Product);

      let { orderProducts } = req.body;
      orderProducts = aggregateOrderProducts(orderProducts);

      if (!orderProducts || !orderProducts.length) {
        throw new Error("No products added to order");
      }

      const userId = Number(req.params.userId);
      const foundUser = await findUserById(userRepository, userId);

      if (!foundUser) {
        throw new Error(`User(${userId}) not found`);
      }

      const { productsToUpdate, orderProductsToSave } =
        await validateAndPrepareProducts(productRepository, orderProducts);

      await productRepository.save(productsToUpdate);

      const newOrder = createNewOrder(orderProductsToSave);
      foundUser.orders.push(newOrder);

      const result = await userRepository.save(foundUser);

      res.status(201).json(result);
    });
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
    userToUpdate.roles = user.roles || userToUpdate.roles;

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

export const listOrders = async (
  req: extendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);

    const orderRepository = AppDataSource.getRepository(Order);

    const orders = await orderRepository.find({
      where: { userId: userId },
      relations: ["orderProducts", "orderProducts.product"],
    });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: `No ordres for user(${req.params.userId})` });
    }

    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export default {
  createUser,
  get,
  getUserByUuid,
  getUserByID,
  updateUser,
  deleteById,
  listOrders,
  deleteUserById,
  createOrderByUserId,
  testUsersList,
};

//byuid
//teste la toate enitatile
//controllerul nu stie de request response da doar raspunusl la handler
// unic id in rute
//teste pe controllerele
