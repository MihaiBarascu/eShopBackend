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
const get = shared.get(User);
const deleteById = shared.deleteById(User);

const createOrderByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const productRepository = AppDataSource.getRepository(Product);

    const { orderProducts } = req.body;
    const userId = Number(req.params.userId);

    const foundUser = await userRepository.findOne({
      where: { id: userId },
      relations: ["orders", "orders.orderProducts"],
    });

    if (!foundUser) {
      return res.status(404).json({ message: `User(${userId}) not found` });
    }

    if (!orderProducts || !orderProducts.length) {
      return res.status(400).json({ message: `No products added to order` });
    }

    const newOrder = new Order();
    newOrder.orderProducts = [] as OrderProducts[];

    for (const orderProduct of orderProducts) {
      const foundProduct = await productRepository.findOneBy({
        id: orderProduct.productId,
      });

      if (!foundProduct) {
        return res
          .status(404)
          .json({ message: `Product (${orderProduct.productId}) not found` });
      }

      if (foundProduct.stock < orderProduct.quantity) {
        return res
          .status(404)
          .json({
            message: `Not enough stock for product (${orderProduct.productId})`,
          });
      }

      foundProduct.stock -= orderProduct.quantity;

      const op = new OrderProducts();
      op.productId = orderProduct.productId;
      op.quantity = orderProduct.quantity;
      op.price = foundProduct.price * orderProduct.quantity;

      newOrder.orderProducts.push(op);
    }

    foundUser.orders.push(newOrder);

    const result = await userRepository.save(foundUser);

    res.status(201).json(result);
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
  getUserByID,
  updateUser,
  deleteById,
  listOrders,
  deleteUserById,
  createOrderByUserId,
};
