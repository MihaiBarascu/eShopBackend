import { Process } from "../../interfaces";
import { CreateUserDto, UpdateUserDto } from "../../dto/user.dto";
import { User } from "../../database/entity/User";
import { AppDataSource } from "../../database/data-source";
import { hashPassword } from "../../utils/hashPassword";
import { Role } from "../../database/entity/Role";
import {
  get,
  deleteById,
  deleteByCriteria,
} from "../../shared/repositoryMethods";
import { PaginationResponse } from "../../interfaces";
import Order from "../../database/entity/Order";
import { transactionContext } from "../../database/transactionContext";
import {
  aggregateOrderProducts,
  findUserById,
} from "../../services/userOrderService";
import { CreateUserOrderDto } from "../../dto/userOrder.dto";
import Product from "../../database/entity/Product";
import {
  validateAndPrepareProducts,
  createNewOrder,
} from "../../services/userOrderService";

export class UserController {
  name: string;
  app: Process;

  constructor() {
    this.name = "UserController";
  }

  createUser = async (usr: CreateUserDto): Promise<User> => {
    const user = new User();

    user.firstName = usr.firstName;
    user.lastName = usr.lastName;
    user.email = usr.email;
    user.password = await hashPassword(usr.password);

    const repository = AppDataSource.getRepository(User);
    const _user = await repository.save(user);
    return _user;
  };

  getUser = async (userId: number): Promise<User> => {
    const userRepository = AppDataSource.getRepository(User);
    return await userRepository.findOneOrFail({
      where: { id: userId },
      relations: ["roles", "orders"],
    });
  };

  addRole = async (uuid: string, roleId: number): Promise<User> => {
    const roleRepository = AppDataSource.getRepository(Role);
    const role = await roleRepository.findOneOrFail({
      where: { id: roleId },
    });

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneOrFail({
      where: { uuid: uuid },
      relations: ["roles"],
    });

    if (user.roles.findIndex((role) => role.id === roleId) !== -1) {
      throw new Error(`User with email ${user.email} is allready ${role.name}`);
    }

    user.roles.push(role);
    return await userRepository.save(user);
  };

  removeRole = async (uuid: string, roleId: number): Promise<User> => {
    const roleRepository = AppDataSource.getRepository(Role);
    const role = await roleRepository.findOneOrFail({
      where: { id: roleId },
    });
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneOrFail({
      where: { uuid: uuid },
      relations: ["roles"],
    });

    user.roles = user.roles.filter((userRole) => userRole.id !== role.id);
    return await userRepository.save(user);
  };

  updateUser = async (
    uuid: string,
    updateUserDto: UpdateUserDto
  ): Promise<User> => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneOrFail({
      where: { uuid },
      relations: ["roles"],
    });
    user.firstName = updateUserDto?.firstName ?? user.firstName;
    user.lastName = updateUserDto?.lastName ?? user.lastName;
    user.email = updateUserDto?.email ?? user.email;
    return await userRepository.save(user);
  };

  // deleteUser = async (userId: number): Promise<void> => {
  //   const userRepository = AppDataSource.getRepository(User);
  //   const user = await userRepository.findOneByOrFail({ id: userId });
  //   await userRepository.softDelete({ id: user.id });
  // };

  deleteUser = async (userId: number): Promise<void> => {
    await deleteById<User>(User, userId);
  };

  listUsers = async (
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<User>> => {
    return await get<User>(User, offset, limit);
  };

  getUserByEmail = async (email: string): Promise<User | null> => {
    return (await get<User>(User, 0, 1, { email })).data[0];
  };

  getUserByUuid = async (uuid: string): Promise<User | null> => {
    return (await get<User>(User, undefined, undefined, { uuid })).data[0];
  };

  getUserWithOrders = async (uuid: string): Promise<User | null> => {
    return (await get<User>(User, undefined, undefined, { uuid }, ["orders"]))
      .data[0];
  };

  listOrders = async (
    uuid: string,
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Order>> => {
    return await get<Order>(Order, offset, limit, { user: { uuid: uuid } }, [
      "user",
      "orderProducts",
    ]);
  };

  getOrder = async (userId: number, orderId: number): Promise<Order> => {
    //uuid
    return (
      await get<Order>(Order, undefined, undefined, { id: orderId, userId })
    ).data[0];
  };

  createOrder = async (
    userUuid: string,
    ordr: CreateUserOrderDto
  ): Promise<Order> => {
    const newOrder = await transactionContext(async (transactionManager) => {
      const userRepository = transactionManager.getRepository(User);
      const productRepository = transactionManager.getRepository(Product);

      let { orderProducts } = ordr;
      orderProducts = aggregateOrderProducts(orderProducts);

      if (!orderProducts || !orderProducts.length) {
        throw new Error("No products added to order");
      }

      const foundUser = await this.getUserWithOrders(userUuid);
      if (!foundUser) {
        throw new Error("No user found");
      }

      const { productsToUpdate, orderProductsToSave } =
        await validateAndPrepareProducts(productRepository, orderProducts);

      await productRepository.save(productsToUpdate);

      const newOrder = createNewOrder(orderProductsToSave);

      console.log("---aici-----");
      console.log(newOrder);
      console.log("---aici-------");

      foundUser.orders.push(newOrder);

      await userRepository.save(foundUser);

      return newOrder;
    });
    return newOrder;
  };

  deleteUserByEmail = async (email: string): Promise<void> => {
    await deleteByCriteria<User>(User, { email });
  };
}
