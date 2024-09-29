import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto";
import { CategoryService } from "../services/CategoryService";
import { PaginationResponse } from "../interfaces";
import Category from "../database/entity/Category";

export class CategoryController {
  name: string;
  categoryService: CategoryService;

  constructor() {
    this.name = "CategoryController";
    this.categoryService = new CategoryService();
  }

  listCategories = async (
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Category>> => {
    return await this.categoryService.listCategories(offset, limit);
  };

  getCatById = async (id: number): Promise<Category> => {
    return await this.categoryService.getCatById(id);
  };

  create = async (dto: CreateCategoryDto) => {
    return await this.categoryService.create(dto);
  };

  generateTree = async () => {
    const categories = await this.categoryService.listCategories();
    return this.categoryService.generateTree(categories.data);
  };

  generateHtmlList = async () => {
    const categories = await this.categoryService.listCategories();
    return this.categoryService.generateHtmlTree(categories.data);
  };

  updateCategory = async (categId: number, categDto: UpdateCategoryDto) => {
    return await this.categoryService.updateCategory(categId, categDto);
  };

  deleteCategoryById = async (categId: number) => {
    return await this.categoryService.deleteCategoryById(categId);
  };

  restoreCategoryById = async (categId: number) => {
    return await this.categoryService.restoreCategoryById(categId);
  };
}
