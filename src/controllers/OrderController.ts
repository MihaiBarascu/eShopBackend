import { CreateOrderDto, UpdateOrderDto } from "../dto/order.dto";
import Order from "../database/entity/Order";
import { PaginationResponse } from "../interfaces";
import { OrderService } from "../services/OrderService";
import { CreateOrderProductsDto } from "../dto/orderProducts.dto";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (ordr: CreateOrderDto): Promise<Order> => {
    return await this.orderService.createOrder(ordr);
  };

  getOrder = async (orderId: number): Promise<Order> => {
    return await this.orderService.getOrder(orderId);
  };

  listOrders = async (
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Order>> => {
    return await this.orderService.listOrder(offset, limit);
  };

  updateOrder = async (
    orderId: number,
    updateOrderDto: UpdateOrderDto
  ): Promise<Order> => {
    return await this.orderService.updateOrder(orderId, updateOrderDto);
  };

  deleteOrder = async (orderId: number): Promise<void> => {
    await this.orderService.deleteOrder(orderId);
  };

  addProducts = async (
    orderId: number,
    orderProdDto: CreateOrderProductsDto[]
  ): Promise<Order> => {
    return await this.orderService.addProductsToOrder(orderId, orderProdDto);
  };

  removeProduct = async (
    orderId: number,
    productId: number
  ): Promise<Order> => {
    return await this.orderService.removeProductFromOrder(orderId, productId);
  };
}

