import { AppDataSource } from "../database/data-source";
import { CreateOrderDto, UpdateOrderDto } from "../dto/order.dto";
import Order from "../database/entity/Order";
import { PaginationResponse } from "../interfaces";
import { get } from "../shared/repositoryMethods";
import Product from "../database/entity/Product";
import OrderProducts from "../database/entity/OrderProducts";
import { CreateOrderProductsDto } from "../dto/orderProducts.dto";
import { transactionContext } from "../database/transactionContext";
import findOneOrFailTreated from "../shared/treatedFindOneOrFailMethod";
import { MissingMemberError } from "../errors/MissingMemberError";

export class OrderService {
  private orderRepository = AppDataSource.getRepository(Order);
  private productRepository = AppDataSource.getRepository(Product);
  private orderProductRepository = AppDataSource.getRepository(OrderProducts);

  async createOrder(ordr: CreateOrderDto): Promise<Order> {
    const newOrder = this.orderRepository.create({
      ...ordr,
    });
    return await this.orderRepository.save(newOrder);
  }

  async getOrder(orderId: number): Promise<Order> {
    return await findOneOrFailTreated(this.orderRepository, orderId);
  }

  async listOrder(
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Order>> {
    return await get(Order, undefined, undefined, offset, limit);
  }

  async updateOrder(
    orderId: number,
    updateOrderDto: UpdateOrderDto
  ): Promise<Order> {
    const orderToUpdate = await findOneOrFailTreated(
      this.orderRepository,
      orderId
    );

    if (!orderToUpdate) {
      throw new Error("Order not found");
    }

    orderToUpdate.type = updateOrderDto.type ?? orderToUpdate.type;
    orderToUpdate.description =
      updateOrderDto.description ?? orderToUpdate.description;
    orderToUpdate.status = updateOrderDto.status ?? orderToUpdate.status;

    return await this.orderRepository.save(orderToUpdate);
  }

  async deleteOrder(orderId: number): Promise<void> {
    const orderToDelete = await findOneOrFailTreated(
      this.orderRepository,
      orderId
    );

    await this.orderRepository.softDelete({ id: orderId });
  }

  async addProductsToOrder(
    orderId: number,
    orderProducts: CreateOrderProductsDto[]
  ): Promise<Order> {
    const order = await transactionContext(async (transactionMangaer) => {
      const orderRepository = transactionMangaer.getRepository(Order);
      const productRepository = transactionMangaer.getRepository(Product);

      const order = await findOneOrFailTreated(this.orderRepository, orderId, {
        orderProducts: true,
      });

      if (!order) {
        throw new Error("Order not found");
      }

      const aggregatedOrderProducts =
        this.aggregateOrderProducts(orderProducts);

      const { productsToUpdate, orderProductsToSave } =
        await this.validateAndPrepareProducts(aggregatedOrderProducts);

      await productRepository.save(productsToUpdate);

      order.orderProducts.push(...orderProductsToSave);

      return await orderRepository.save(order);
    });
    return order;
  }

  aggregateOrderProducts(
    orderProducts: CreateOrderProductsDto[]
  ): CreateOrderProductsDto[] {
    console.log("----------------");
    console.log(orderProducts);
    console.log("----------------");
    return Object.values(
      orderProducts.reduce((acc, curr) => {
        if (acc[curr.productId]) {
          acc[curr.productId].quantity += curr.quantity;
        } else {
          acc[curr.productId] = { ...curr };
        }

        return acc;
      }, {} as Record<number, CreateOrderProductsDto>)
    );
  }

  async validateAndPrepareProducts(
    orderProducts: CreateOrderProductsDto[]
  ): Promise<{
    productsToUpdate: Product[];
    orderProductsToSave: OrderProducts[];
  }> {
    const productsToUpdate: Product[] = [];
    const orderProductsToSave: OrderProducts[] = [];

    for (const orderProduct of orderProducts) {
      const foundProduct = await this.productRepository.findOneBy({
        id: orderProduct.productId,
      });

      if (!foundProduct) {
        throw new Error(`Product (${orderProduct.productId}) not found`);
      }

      if (foundProduct.stock < orderProduct.quantity) {
        throw new Error(
          `Not enough stock for product (${orderProduct.productId})`
        );
      }
      foundProduct.stock -= orderProduct.quantity;

      const op = new OrderProducts();
      op.productId = orderProduct.productId;
      op.quantity = orderProduct.quantity;
      op.price = foundProduct.price * orderProduct.quantity;

      orderProductsToSave.push(op);
      productsToUpdate.push(foundProduct);
    }

    return { productsToUpdate, orderProductsToSave };
  }

  async removeProductFromOrder(
    orderId: number,
    productId: number
  ): Promise<Order> {
    const order = await findOneOrFailTreated(this.orderRepository, orderId, {
      orderProducts: true,
    });

    if (!order.orderProducts) {
      throw new MissingMemberError(`Order (${orderId}) has no products`);
    }

    const orderProducts = order.orderProducts.filter(
      (op) => op.productId === productId
    );

    if (orderProducts.length === 0) {
      throw new MissingMemberError(`Product (${productId}) not found in order`);
    }

    const product = await findOneOrFailTreated(
      this.productRepository,
      productId
    );

    for (const orderProduct of orderProducts) {
      product.stock += orderProduct.quantity;
      await this.orderProductRepository.remove(orderProduct);
    }

    await this.productRepository.save(product);

    order.orderProducts = order.orderProducts.filter(
      (op) =>
        op.productId !== productId &&
        op.productId !== undefined &&
        op.orderId !== undefined
    );

    const result = await this.orderRepository.save(order);

    return result;
  }
}
