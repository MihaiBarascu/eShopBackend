import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import Product from "../database/entity/Product";
import { AppDataSource } from "../database/data-source";
import Category from "../database/entity/Category";
import { PaginationResponse } from "../interfaces";
import { get, getById } from "../shared/repositoryMethods";
import { error as logError } from "../utils/logger";

export class ProductController {
  name: string;

  constructor() {}

  addCategory = async (prodId: number, categId: number) => {
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
      throw new Error("Duplicate Cateogry");
    }

    prodWithRelations.categories.push(foundCateg);

    return await AppDataSource.getRepository(Product).save(prodWithRelations);
  };

  listProducts = async (
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Product>> => {
    return await get(Product, undefined, undefined, offset, limit);
  };

  getProductById = async (productId: number): Promise<Product> => {
    return await getById<Product>(Product, productId);
  };

  createProduct = async (prodDto: CreateProductDto) => {
    const newProduct = new Product();

    newProduct.name = prodDto.name;
    newProduct.description = prodDto.description;
    newProduct.price = prodDto.price;
    newProduct.stock = prodDto.stock;
    newProduct.isActive = prodDto.isActive;

    if (prodDto.categories && prodDto.categories.length) {
      const categoryRepository = AppDataSource.getRepository(Category);

      const categories = await categoryRepository.find({
        where: prodDto.categories.map((id: number) => ({ id })),
      });

      if (categories) {
        newProduct.categories = categories;
      }
    }

    return await AppDataSource.getRepository(Product).save(newProduct);
  };

  updateProduct = async (productId: number, productDto: UpdateProductDto) => {
    const productRep = AppDataSource.getRepository(Product);

    const foundProd = await productRep.findOneOrFail({
      where: { id: productId },
    });

    foundProd.name = productDto.name || foundProd.name;
    foundProd.description = productDto.description || foundProd.description;
    foundProd.price = productDto.price || foundProd.price;
    foundProd.stock = productDto.stock || foundProd.stock;
    foundProd.isActive = productDto.isActive ?? foundProd.isActive;

    if (productDto.categories && productDto.categories.length) {
      const categoryRepository = AppDataSource.getRepository(Category);

      const categories = await categoryRepository.find({
        where: productDto.categories.map((id: number) => ({ id })),
      });

      if (categories) {
        foundProd.categories = categories;
      }
    }

    return await productRep.save(foundProd);
  };
}

