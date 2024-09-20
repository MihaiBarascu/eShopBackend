import { Request, Response, NextFunction } from "express";
import Order from "../database/entity/Order";
import { User } from "../database/entity/User";
import { AppDataSource } from "../database/data-source";
import { ROLES_LIST } from "../utils/config";
import { extendedRequest } from "../utils/types";

export const listOrders = async (
  req: extendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);

    if (!req.roles?.includes(ROLES_LIST.Admin) && req.id !== userId) {
      return res.status(403).json({ message: "You are not authorized" });
    }

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

