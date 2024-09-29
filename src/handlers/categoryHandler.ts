import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import { User } from "../database/entity/User";
import { CategoryController } from "../controllers/CategoryController";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { CreateUserOrderDto } from "../dto/userOrder.dto";
import { extendedRequest } from "../utils/types";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto";
import { plainToInstance } from "class-transformer";

class CategoryHandler {
  private categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
  }

  getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = Number(req.params.categoryId);
      if (!categoryId) {
        return res
          .status(400)
          .json({ message: "invalid category id param or missing" });
      }

      return res.json(await this.categoryController.getCatById(categoryId));
    } catch (err) {
      next(err);
    }
  };

  getCategoryList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const offset = Number(req.query.offset) || undefined;
      const limit = Number(req.query.limit) || undefined;

      return res.json(
        await this.categoryController.listCategories(offset, limit)
      );
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

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = Number(req.params.categoryId);
      if (!categoryId) {
        return res
          .status(400)
          .json({ message: "invalid category id param or missing" });
      }

      const categoryData = plainToInstance(UpdateCategoryDto, req.body);

      return res.json(
        await this.categoryController.updateCategory(categoryId, categoryData)
      );
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = Number(req.params.categoryId);
      if (!categoryId) {
        return res
          .status(400)
          .json({ message: "invalid category id param or missing" });
      }

      return res.json(
        await this.categoryController.deleteCategoryById(categoryId)
      );
    } catch (error) {
      next(error);
    }
  };
}

const categoryHandler = new CategoryHandler();
export default categoryHandler;
