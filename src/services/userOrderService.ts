import { Repository } from "typeorm";
import { User } from "../database/entity/User";
import Product from "../database/entity/Product";
import Order from "../database/entity/Order";
import OrderProducts from "../database/entity/OrderProducts";
import { UserOrderProdDto } from "../dto/userOrderProducts.dto";

export const aggregateOrderProducts = (
  orderProducts: UserOrderProdDto[]
): UserOrderProdDto[] => {
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
    }, {} as Record<number, UserOrderProdDto>)
  );
};

export const findUserById = async (
  userRepository: Repository<User>,
  userId: number
): Promise<User | null> => {
  return await userRepository.findOne({
    where: { id: userId },
    relations: ["orders", "orders.orderProducts"],
  });
};

export const validateAndPrepareProducts = async (
  productRepository: Repository<Product>,
  orderProducts: UserOrderProdDto[]
): Promise<{
  productsToUpdate: Product[];
  orderProductsToSave: OrderProducts[];
}> => {
  const productsToUpdate: Product[] = [];
  const orderProductsToSave: OrderProducts[] = [];

  for (const orderProduct of orderProducts) {
    const foundProduct = await productRepository.findOneBy({
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
};

export const createNewOrder = (orderProducts: OrderProducts[]): Order => {
  const newOrder = new Order();
  newOrder.orderProducts = orderProducts;
  return newOrder;
};
