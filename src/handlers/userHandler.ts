import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import { User } from "../database/entity/User";
import { UserController } from "../controllers/user/UserController";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { CreateUserOrderDto } from "../dto/userOrder.dto";
import { extendedRequest } from "../utils/types";

class UserHandler {
  private userController: UserController;

  constructor() {
    this.userController = new UserController();

    this.userController = new UserController();
    this.getUsersList = this.getUsersList.bind(this);
    this.getUserByUuid = this.getUserByUuid.bind(this);
    this.addUserRole = this.addUserRole.bind(this);
    this.removeUserRole = this.removeUserRole.bind(this);
    this.createOrder = this.createOrder.bind(this);
    this.deleteUserById = this.deleteUserById.bind(this);
    this.getUserByID = this.getUserByID.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.listOrders = this.listOrders.bind(this);
  }

  async getUsersList(req: Request, res: Response, next: NextFunction) {
    try {
      const offset = Number(req.query.offset) || undefined;
      const limit = Number(req.query.limit) || undefined;

      return res.json(await this.userController.listUsers(offset, limit));
    } catch (err) {
      next(err);
    }
  }

  async getUserByUuid(req: Request, res: Response, next: NextFunction) {
    try {
      const foundUser = await this.userController.getUserByUuid(
        req.params.uuid
      );
      return res.json(foundUser);
    } catch (error) {
      next(error);
    }
  }

  async addUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = Number(req.body.roleToAdd);
      if (!roleId)
        return res
          .status(400)
          .json({ message: "roleToAdd field is missing from body" });

      const updatedUser = await this.userController.addRole(
        req.params.uuid,
        req.body.roleToAdd
      );

      const roles = updatedUser.roles.map((role) => role.name);

      return res.status(200).json({ updatedRoles: roles });
    } catch (error) {
      next(error);
    }
  }

  async removeUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      const roleId = Number(req.params.roleId);
      if (!roleId)
        return res.status(400).json({ message: "roleId param is missing" });

      const updatedUser = await this.userController.removeRole(
        req.params.uuid,
        roleId
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userUuid = req.params.uuid;
      const order: CreateUserOrderDto = req.body.userOrder;

      if (!order) {
        return res
          .status(400)
          .json({ message: "userOrder is missing for request body" });
      }

      const result = await this.userController.createOrder(userUuid, order);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AppDataSource.getRepository(User).delete(
        req.params.userId
      );

      if (result.affected === 0) {
        return res
          .status(404)
          .json({ message: `User with id${req.params.userId} not found` });
      }
      res.status(200).json({ message: `User (${req.params.userId}) deleted` });
    } catch (error) {
      next(error);
    }
  }

  async getUserByID(req: Request, res: Response, next: NextFunction) {
    try {
      const repository = AppDataSource.getRepository(User);
      const foundUser = await repository.findOneBy({
        id: Number(req.params.userId),
      });

      if (foundUser) {
        res.json(foundUser);
      } else {
        res
          .status(404)
          .json({ message: `User with id ${req.params.userId} not found` });
      }
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const user = new CreateUserDto();

      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.password = password;

      await this.userController.createUser(user);

      const userDetails = { firstName, lastName, email, password: "******" };

      return res.status(200).json(userDetails);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user: UpdateUserDto = req.body;
      const uuid = req.params.uuid;

      const updatedUser = await this.userController.updateUser(uuid, user);

      const { firstName, lastName, email } = updatedUser;

      const userDetails = { firstName, lastName, email };

      return res.status(200).json(userDetails);
    } catch (error) {
      next(error);
    }
  }

  async listOrders(req: extendedRequest, res: Response, next: NextFunction) {
    try {
      const uuid = req.params.uuid;
      const offset = Number(req.query.offset) || undefined;
      const limit = Number(req.query.limit) || undefined;

      return res
        .status(200)
        .json(await this.userController.listOrders(uuid, offset, limit));
    } catch (error) {
      next(error);
    }
  }
}

const userHandler = new UserHandler();
export default userHandler;
