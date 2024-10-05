import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { User } from "../database/entity/User";
import { AppDataSource } from "../database/data-source";
import { hashPassword } from "../utils/hashPassword";
import { Role } from "../database/entity/Role";
import { get, deleteById, deleteByCriteria } from "../shared/repositoryMethods";
import { PaginationResponse } from "../interfaces";
import Order from "../database/entity/Order";
import { transactionContext } from "../database/transactionContext";

import Product from "../database/entity/Product";
import { UserOrderService } from "./UserOrderSerive";
import { CreateUserOrderDto } from "../dto/userOrder.dto";
import SanitizedOrder from "../serializers/order";
import { plainToInstance } from "class-transformer";
import { DeleteResult, EntityNotFoundError, UpdateResult } from "typeorm";
import findOneOrFailTreated from "../shared/treatedFindOneOrFailMethod";
import { DuplicateMemberError } from "../errors/DuplicateMemberError";
import { NonExistentIdError } from "../errors/NonExistentIdError";
import { MissingMemberError } from "../errors/MissingMemberError";

export class UserService {
  userOrderService: UserOrderService;

  constructor() {
    this.userOrderService = new UserOrderService();
  }

  getUserByUuidWithRolesRel = async (uuid: string): Promise<User> => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      return await userRepository.findOneOrFail({
        where: { uuid: uuid },
        relations: { roles: true },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NonExistentIdError(
          `User with uuid: ${uuid} doesn't exist in the database`
        );
      }
      throw error;
    }
  };

  async createUser(usr: CreateUserDto): Promise<User> {
    const user = new User();
    user.firstName = usr.firstName;
    user.lastName = usr.lastName;
    user.email = usr.email;
    user.password = await hashPassword(usr.password);

    const repository = AppDataSource.getRepository(User);
    return await repository.save(user);
  }

  async resetPassword(userId: number, newPass: string): Promise<User> {
    const foundUser = await this.getUser(userId);
    foundUser.password = await hashPassword(newPass);

    const repository = AppDataSource.getRepository(User);

    return await repository.save(foundUser);
  }

  async getUser(userId: number): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    return await findOneOrFailTreated(userRepository, userId);
  }

  async addRole(uuid: string, roleId: number): Promise<User> {
    const roleRepository = AppDataSource.getRepository(Role);

    const role = await findOneOrFailTreated(roleRepository, roleId);

    const user = await this.getUserByUuidWithRolesRel(uuid);

    if (user.roles.findIndex((role) => role.id === roleId) !== -1) {
      throw new DuplicateMemberError(
        `User with email ${user.email} is already ${role.name}`
      );
    }

    user.roles.push(role);
    return await AppDataSource.getRepository(User).save(user);
  }

  async removeRole(uuid: string, roleId: number): Promise<User> {
    const roleRepository = AppDataSource.getRepository(Role);

    await findOneOrFailTreated(roleRepository, roleId);

    const userRepository = AppDataSource.getRepository(User);
    const user = await this.getUserByUuidWithRolesRel(uuid);

    const roleIndex = user.roles.findIndex((role) => role.id === roleId);
    if (roleIndex === -1) {
      throw new MissingMemberError(
        `User with uuid ${uuid} doesn't have role with id ${roleId}`
      );
    }

    user.roles.splice(roleIndex, 1);

    return await userRepository.save(user);
  }

  async updateUser(uuid: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await this.getUserByUuidWithRolesRel(uuid);
    user.firstName = updateUserDto?.firstName ?? user.firstName;
    user.lastName = updateUserDto?.lastName ?? user.lastName;
    user.email = updateUserDto?.email ?? user.email;
    return await userRepository.save(user);
  }

  async deleteUser(userId: number): Promise<DeleteResult> {
    return await deleteById<User>(User, userId);
  }

  async listUsers(
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<User>> {
    return await get<User>(User, undefined, undefined, offset, limit);
  }

  async getUserByEmailWithRoles(email: string): Promise<User | null> {
    return (await get<User>(User, { email }, { roles: true })).data[0];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return (await get<User>(User, { email })).data[0];
  }

  async getUserByUuid(uuid: string): Promise<User | null> {
    return (await get<User>(User, { uuid })).data[0];
  }

  async getUserWithOrders(uuid: string): Promise<User | null> {
    return (await get<User>(User, { uuid }, { orders: true })).data[0];
  }

  async listOrders(
    uuid: string,
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Order>> {
    return await get<Order>(
      Order,
      { user: { uuid: uuid } },
      { user: true, orderProducts: true },
      offset,
      limit
    );
  }

  async listOrdersSanitized(
    uuid: string,
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<SanitizedOrder>> {
    const orders: PaginationResponse<Order> = await this.listOrders(
      uuid,
      offset,
      limit
    );

    const sanitizedOrdersData = orders.data.map((order) =>
      plainToInstance(SanitizedOrder, order)
    );

    const sanitizedOrders: PaginationResponse<SanitizedOrder> = {
      data: sanitizedOrdersData,
      meta: orders.meta,
    };

    return sanitizedOrders;
  }

  async getOrder(userId: number, orderId: number): Promise<Order> {
    return (await get<Order>(Order, { id: orderId, userId })).data[0];
  }

  async createOrder(
    userUuid: string,
    ordr: CreateUserOrderDto
  ): Promise<Order> {
    const newOrder = await transactionContext(async (transactionManager) => {
      const userRepository = transactionManager.getRepository(User);
      const productRepository = transactionManager.getRepository(Product);

      let { orderProducts } = ordr;
      orderProducts =
        this.userOrderService.aggregateOrderProducts(orderProducts);

      if (!orderProducts || !orderProducts.length) {
        throw new Error("No products added to order");
      }

      const foundUser = await this.getUserWithOrders(userUuid);
      if (!foundUser) {
        throw new Error("No user found");
      }

      const { productsToUpdate, orderProductsToSave } =
        await this.userOrderService.validateAndPrepareProducts(
          productRepository,
          orderProducts
        );

      await productRepository.save(productsToUpdate);

      const newOrder =
        this.userOrderService.createNewOrder(orderProductsToSave);

      foundUser.orders.push(newOrder);

      await userRepository.save(foundUser);

      return newOrder;
    });
    return newOrder;
  }

  async deleteUserByEmail(email: string): Promise<UpdateResult> {
    return await deleteByCriteria<User>(User, { email });
  }
}

//ii trimit link la care atasez token de autentificare pe care ilg generez
// ruta la un token pe care il generez
