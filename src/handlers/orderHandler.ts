import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { CreateOrderDto, UpdateOrderDto } from "../dto/order.dto";
import { OrderController } from "../controllers/OrderController";
import { validateFields } from "../shared/utils";
import SanitizedOrder from "../serializers/order";

class OrderHandler {
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
  }

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(CreateOrderDto, req.body);

      const result = await this.orderController.createOrder(dto);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      if (!orderId) {
        return res
          .status(400)
          .json({ message: "userId or orderId param is invalid or undefined" });
      }

      const result = await this.orderController.getOrder(orderId);

      const sanitizedOrder = plainToInstance(SanitizedOrder, result);

      res.status(200).json(sanitizedOrder);
    } catch (error) {
      next(error);
    }
  };

  listOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const offset = req.query.offset ? Number(req.query.offset) : undefined;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const result = await this.orderController.listOrders(offset, limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.orderId);
      if (!orderId) {
        return res
          .status(400)
          .json({ message: "orderId param is invalid or undefined" });
      }

      const dto = plainToInstance(UpdateOrderDto, req.body);
      const result = await this.orderController.updateOrder(orderId, dto);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateFields(req, {
        params: { orderId: "orderId" },
      });

      const orderId = Number(req.params.orderId);

      await this.orderController.deleteOrder(orderId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  addProductsToOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      validateFields(req, { params: { orderId: "orderId" } });

      const orderId = Number(req.params.orderId);

      const products = req.body.orderProducts;

      const result = await this.orderController.addProducts(orderId, products);

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  removeProductFromOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      validateFields(req, {
        params: { orderId: "orderId", productId: "productId" },
      });

      const orderId = Number(req.params.orderId);
      const productId = Number(req.params.productId);

      const result = await this.orderController.removeProduct(
        orderId,
        productId
      );

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

const orderHandler = new OrderHandler();
export default orderHandler;

