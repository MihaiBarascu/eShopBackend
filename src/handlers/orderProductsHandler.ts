import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import OrderProducts from "../database/entity/OrderProducts";
import Order from "../database/entity/Order";
import Product from "../database/entity/Product";

const get = shared.get(OrderProducts);
const deleteById = shared.deleteById(OrderProducts);
const getByID = shared.getByID(OrderProducts);
const create = shared.create(OrderProducts);
const update = shared.update(OrderProducts);

const createOrderProducts = async (request: Request, response: Response) => {
  try {
    const orderRepostiory = AppDataSource.getRepository(Order);

    const productRepostiory = AppDataSource.getRepository(Product);

    const { orderId, productId, quantity, isReady, status, description } =
      request.body;

    const order = await orderRepostiory.findOneBy({ id: orderId });
    const product = await productRepostiory.findOneBy({ id: productId });

    if (!order) {
      return response
        .status(404)
        .json({ message: `order with id ${orderId} not found` });
    }

    if (!product) {
      return response
        .status(404)
        .json({ message: `product with id ${productId} not found` });
    }
    const price = product.price;

    const orderPrd = new OrderProducts();
    orderPrd.orderId = orderId;
    orderPrd.productId = productId;
    orderPrd.quantity = quantity;
    orderPrd.price = price * quantity;
    orderPrd.isReady = isReady;
    orderPrd.status = status;
    orderPrd.description = description;
    orderPrd.order = order;
    orderPrd.product = product;

    const orderProductRepository = AppDataSource.getRepository(OrderProducts);

    const result = await orderProductRepository.save(orderPrd);
    response.status(201).json(result);
  } catch (error) {
    response.status(500).json({ error });
  }
};

const updateOrderProduct = async (request: Request, response: Response) => {
  try {
    const orderProductRepository = AppDataSource.getRepository(OrderProducts);

    const orderPrd = await orderProductRepository.findOneBy({
      id: Number(request.params.id),
    });
    if (!orderPrd) {
      return response.status(404).json({
        message: `order product with id : ${request.params.id} not found`,
      });
    }

    const orderRepostiory = AppDataSource.getRepository(Order);

    const productRepostiory = AppDataSource.getRepository(Product);

    const { orderId, productId, quantity, isReady, status, description } =
      request.body;

    const order = await orderRepostiory.findOneBy({ id: orderId });
    const product = await productRepostiory.findOneBy({ id: productId });

    if (!order) {
      return response
        .status(404)
        .json({ message: `order with id ${orderId} not found` });
    }

    if (!product) {
      return response
        .status(404)
        .json({ message: `product with id ${productId} not found` });
    }
    const price = product.price;

    orderPrd.orderId = orderId;
    orderPrd.productId = productId;
    orderPrd.quantity = quantity ?? orderPrd.quantity;
    orderPrd.price = price * orderPrd.quantity;
    orderPrd.isReady = isReady ?? orderPrd.isReady;
    orderPrd.status = status ?? orderPrd.status;
    orderPrd.description = description ?? orderPrd.description;
    orderPrd.order = order ?? orderPrd.order;
    orderPrd.product = product;

    const result = await orderProductRepository.save(orderPrd);
    response.status(201).json(result);
  } catch (error) {
    response.status(500).json({ error });
  }
};

export default {
  create,
  get,
  getByID,
  update,
  deleteById,
  createOrderProducts,
  updateOrderProduct,
};

