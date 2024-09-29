import Category from "../database/entity/Category";
import { UpdateCategoryDto } from "../dto/category.dto";
import { AppDataSource } from "../database/data-source";
import Product from "../database/entity/Product";
import { PaginationResponse } from "../interfaces";
import {
  get,
  getById,
  simpleCreate,
  deleteById,
  restoreById,
} from "../shared/repositoryMethods";
import { CreateCategoryDto } from "../dto/category.dto";

import { error as logError } from "../utils/logger";
export class CategoryService {
  constructor() {}

  async listCategories(
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Category>> {
    return await get(Category, undefined, undefined, offset, limit);
  }

  async getCatById(id: number): Promise<Category> {
    return await getById(Category, id);
  }
  async create(dto: CreateCategoryDto) {
    return await simpleCreate(Category, dto);
  }

  async updateCategory(categId: number, categDto: UpdateCategoryDto) {
    const categRep = AppDataSource.getRepository(Category);

    const foundCateg = await categRep.findOneOrFail({ where: { id: categId } });

    foundCateg.name = categDto.name || foundCateg.name;
    foundCateg.description = categDto.description || foundCateg.description;
    foundCateg.parentId = categDto.parentId || foundCateg.parentId;
    foundCateg.isActive =
      categDto.isActive !== undefined ? categDto.isActive : foundCateg.isActive;

    return await categRep.save(foundCateg);
  }

  async deleteCategoryById(categId: number) {
    return await deleteById<Category>(Category, categId);
  }

  async restoreCategoryById(categId: number) {
    return await restoreById<Category>(Category, categId);
  }

  generateTree = (categories: Category[]) => {
    const maxId = Math.max(...categories.map((categ) => categ.id));

    let idIndexValueParentId: (number | null)[] = Array(maxId + 1).fill(null);
    let idIndexValueData: (string | null)[] = Array(maxId + 1).fill(null);

    categories.forEach((category) => {
      idIndexValueParentId[category.id] = category.isActive
        ? category.parentId || -1
        : null;
    });
    idIndexValueParentId[0] = null;

    categories.forEach((category) => {
      idIndexValueData[category.id] = category.name;
    });

    type Nod = {
      nodeId: number | null;
      children: Nod[];
    };

    const categNode: Nod = {
      nodeId: -1,
      children: [],
    };

    function generate(nod: Nod) {
      if (idIndexValueParentId.every((val) => val === null)) return;

      idIndexValueParentId.forEach((parentId, id) => {
        if (parentId === nod.nodeId && parentId !== null) {
          nod.children.push({ nodeId: id, children: [] });
          idIndexValueParentId[id] = null;
          nod.children.forEach((node) => {
            generate(node);
          });
        }
      });
    }

    generate(categNode);
    return { categNode, idIndexValueData };
  };

  generateHtmlTree = (categories: Category[]): string => {
    const { categNode, idIndexValueData } = this.generateTree(categories);

    const displayedCategories = new Set<number>();

    const generate = (node: any): string => {
      const nodeName =
        idIndexValueData[node.nodeId] !== null &&
        idIndexValueData[node.nodeId] !== undefined
          ? idIndexValueData[node.nodeId]
          : "Categories";

      if (displayedCategories.has(node.nodeId)) {
        return "";
      }

      displayedCategories.add(node.nodeId);

      if (!node.children || node.children.length === 0) {
        return `<li>${nodeName} (${node.nodeId})</li>`;
      }

      const childrenHtml = node.children
        .map((child: any) => generate(child))
        .join("");
      return `<li>${nodeName} (${
        node.nodeId !== -1 ? node.nodeId : ""
      })<ul>${childrenHtml}</ul></li>`;
    };

    const htmlTree = `<ul>${generate(categNode)}</ul>`;

    return htmlTree;
  };
  async removeCategory(prodId: number, categId: number) {
    const categRepo = AppDataSource.getRepository(Category);
    const foundCateg = await categRepo.findOneByOrFail({ id: categId });

    const prodWithRelations: Product = (
      await get(Product, { id: prodId }, { categories: true })
    ).data[0];

    if (!prodWithRelations) {
      logError(
        `error removing category from product: product with id ${prodId} not found`
      );
      throw new Error("Product not found");
    }

    const categoryIndex = prodWithRelations.categories.findIndex(
      (category) => category.id === foundCateg.id
    );
    if (categoryIndex === -1) {
      logError(
        `error removing category from product: product with id ${prodId} is not part of category with id ${categId}`
      );
      throw new Error("Category not found in product");
    }

    prodWithRelations.categories.splice(categoryIndex, 1);

    return await AppDataSource.getRepository(Product).save(prodWithRelations);
  }

  async addCategory(prodId: number, categId: number) {
    const categRepo = AppDataSource.getRepository(Category);

    const foundCateg = await categRepo.findOneByOrFail({ id: categId });

    const prodWithRelations: Product = (
      await get(Product, { id: prodId }, { categories: true })
    ).data[0];

    if (!prodWithRelations) {
      logError(
        `error adding category to product: product with id ${prodId} not found`
      );
      throw new Error("Product not found");
    }

    const allreadyHaveCat = prodWithRelations.categories.findIndex(
      (category) => category.id === foundCateg.id
    );
    if (allreadyHaveCat !== -1) {
      logError(
        `error adding category to product: product with id ${prodId} is allready part of category with id ${categId}`
      );
      throw new Error("Duplicate Category");
    }

    prodWithRelations.categories.push(foundCateg);

    return await AppDataSource.getRepository(Product).save(prodWithRelations);
  }
}
