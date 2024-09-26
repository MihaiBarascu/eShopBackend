import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import { User } from "../database/entity/User";
import { CategoryController } from "../controllers/CategoryController";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { CreateUserOrderDto } from "../dto/userOrder.dto";
import { extendedRequest } from "../utils/types";
import { CreateCategoryDto } from "../dto/category.dto";
import { plainToInstance } from "class-transformer";

class CategoryHandler {
  private categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
  }

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.json(await this.categoryController.get());
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(CreateCategoryDto, req.body);

      const result = await this.categoryController.create(dto);

      return res.json({ result });
    } catch (err) {
      next(err);
    }
  };

  getTree = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.categoryController.generateTree();

      return res.json({ result });
    } catch (err) {
      next(err);
    }
  };

  getHtmlList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const htmlList = await this.categoryController.generateHtmlList();

      return res.send(htmlList);
    } catch (err) {
      next(err);
    }
  };
}

const categoryHandler = new CategoryHandler();
export default categoryHandler;

