import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto";
import { CategoryService } from "../services/CategoryService";
import { PaginationResponse } from "../interfaces";
import Category from "../database/entity/Category";
import { NonExistentParentIdError } from "../errors/NonExistentParentId";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { NonExistentIdError } from "../errors/NonExistentIdError";

export class CategoryController {
  name: string;
  categoryService: CategoryService;

  constructor() {
    this.name = "CategoryController";
    this.categoryService = new CategoryService();
  }

  async listCategories(
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Category>> {
    return await this.categoryService.listCategories(offset, limit);
  }

  async getCatById(id: number): Promise<Category> {
    return await this.categoryService.getCatById(id);
  }

  async create(dto: CreateCategoryDto) {
    try {
      return await this.categoryService.create(dto);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes("a foreign key constraint fails")
      ) {
        throw new NonExistentParentIdError(
          "Invalid parentId: The specified parentId does not exist."
        );
      }
      throw error;
    }
  }

  async generateTree() {
    const categories = await this.categoryService.listCategories();
    return this.categoryService.generateTree(categories.data);
  }

  async generateHtmlList() {
    const categories = await this.categoryService.listCategories();
    return this.categoryService.generateHtmlTree(categories.data);
  }

  async updateCategory(categId: number, categDto: UpdateCategoryDto) {
    try {
      return await this.categoryService.updateCategory(categId, categDto);
    } catch (error) {
      if (
        error instanceof EntityNotFoundError &&
        error.message.includes("not find any entity of type")
      ) {
        throw new NonExistentIdError(
          "The specified category id does note exists"
        );
      }
      throw error;
    }
  }

  async deleteCategoryById(categId: number) {
    return await this.categoryService.deleteCategoryById(categId);
  }

  async restoreCategoryById(categId: number) {
    return await this.categoryService.restoreCategoryById(categId);
  }
}
