import { AppDataSource } from "../database/data-source";
import Category from "../database/entity/Category";
import { simpleGet, simpleCreate } from "../shared/repositoryMethods";
import { CreateCategoryDto } from "../dto/category.dto";
import { CategoryService } from "../services/CategoryService";

export class CategoryController {
  name: string;
  categorySerives: CategoryService;

  constructor() {
    this.name = "CategoryController";
    this.categorySerives = new CategoryService();
  }

  get = async () => await simpleGet(Category);

  create = async (dto: CreateCategoryDto) => await simpleCreate(Category, dto);

  generateTree = async () => {
    const categories = await this.get();

    return this.categorySerives.generateTree(categories);
  };

  generateHtmlList = async () => {
    const categories = await this.get();
    return this.categorySerives.generateHtmlTree(categories);
  };
}

