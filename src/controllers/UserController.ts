import { UserService } from "../services/UserService";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { User } from "../database/entity/User";
import { PaginationResponse } from "../interfaces";
import Order from "../database/entity/Order";
import { CreateUserOrderDto } from "../dto/userOrder.dto";
import SanitizedOrder from "../serializers/order";
import { DeleteResult, UpdateResult } from "typeorm";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (usr: CreateUserDto): Promise<User> => {
    return await this.userService.createUser(usr);
  };

  getUser = async (userId: number): Promise<User> => {
    return await this.userService.getUser(userId);
  };

  addRole = async (uuid: string, roleId: number): Promise<User> => {
    return await this.userService.addRole(uuid, roleId);
  };

  removeRole = async (uuid: string, roleId: number): Promise<User> => {
    return await this.userService.removeRole(uuid, roleId);
  };

  updateUser = async (
    uuid: string,
    updateUserDto: UpdateUserDto
  ): Promise<User> => {
    return await this.userService.updateUser(uuid, updateUserDto);
  };

  deleteUser = async (userId: number): Promise<DeleteResult> => {
    return await this.userService.deleteUser(userId);
  };

  listUsers = async (
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<User>> => {
    return await this.userService.listUsers(offset, limit);
  };

  getUserByEmail = async (email: string): Promise<User | null> => {
    return await this.userService.getUserByEmail(email);
  };

  getUserByEmailWithRoles = async (email: string): Promise<User | null> => {
    return await this.userService.getUserByEmailWithRoles(email);
  };

  getUserByUuid = async (uuid: string): Promise<User | null> => {
    return await this.userService.getUserByUuid(uuid);
  };

  getUserWithOrders = async (uuid: string): Promise<User | null> => {
    return await this.userService.getUserWithOrders(uuid);
  };

  listOrders = async (
    uuid: string,
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Order>> => {
    return await this.userService.listOrders(uuid, offset, limit);
  };

  listOrdersSanitized = async (
    uuid: string,
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<SanitizedOrder>> => {
    return await this.userService.listOrdersSanitized(uuid, offset, limit);
  };

  getOrder = async (userId: number, orderId: number): Promise<Order> => {
    return await this.userService.getOrder(userId, orderId);
  };

  createOrder = async (
    userUuid: string,
    ordr: CreateUserOrderDto
  ): Promise<Order> => {
    return await this.userService.createOrder(userUuid, ordr);
  };

  deleteUserByEmail = async (email: string): Promise<UpdateResult> => {
    return await this.userService.deleteUserByEmail(email);
  };
}

////parent id, id din acceasi tabela, is active categroie, is active produse,
