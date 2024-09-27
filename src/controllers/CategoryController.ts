import { AppDataSource } from "../database/data-source";
import Category from "../database/entity/Category";
import {
  simpleGet,
  simpleCreate,
  deleteById,
  restoreById,
  get,
  getById,
} from "../shared/repositoryMethods";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto";
import { CategoryService } from "../services/CategoryService";
import { PaginationResponse } from "../interfaces";

export class CategoryController {
  name: string;
  categorySerives: CategoryService;

  constructor() {
    this.name = "CategoryController";
    this.categorySerives = new CategoryService();
  }

  listCategories = async (
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Category>> => {
    return await get(Category, undefined, undefined, offset, limit);
  };

  getCatById = async (id: number): Promise<Category> => {
    return await getById(Category, id);
  };

  create = async (dto: CreateCategoryDto) => await simpleCreate(Category, dto);

  generateTree = async () => {
    const categories = await simpleGet(Category);

    return this.categorySerives.generateTree(categories);
  };

  generateHtmlList = async () => {
    const categories = await simpleGet(Category);
    return this.categorySerives.generateHtmlTree(categories);
  };

  updateCategory = async (categId: number, categDto: UpdateCategoryDto) => {
    const categRep = AppDataSource.getRepository(Category);

    const foundCateg = await categRep.findOneOrFail({ where: { id: categId } });

    foundCateg.name = categDto.name || foundCateg.name;
    foundCateg.description = categDto.description || foundCateg.description;
    foundCateg.parentId = categDto.parentId || foundCateg.parentId;
    foundCateg.isActive =
      categDto.isActive !== undefined ? categDto.isActive : foundCateg.isActive;

    return await categRep.save(foundCateg);
  };

  deleteCateogryById = async (categId: number) => {
    console.log(categId);
    return await deleteById<Category>(Category, categId);
  };

  restoreCateogryById = async (categId: number) => {
    console.log(categId);
    return await restoreById<Category>(Category, categId);
  };
}

