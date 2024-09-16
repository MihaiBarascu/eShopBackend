import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import Product from "../database/entity/Product";
import Category from "../database/entity/Category";

const get = shared.get(Product);
const deleteById = shared.deleteById(Product);
const getByID = shared.getByID(Product);
const create = shared.create(Product);
const update = shared.update(Product);

const createProduct = async (request: Request, response: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const categoryRepository = AppDataSource.getRepository(Category);
    const { name, description, price, categories, stock } = request.body;

    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    if (categories) {
      const categoriesEntities = await categoryRepository.find({
        where: categories.map((id: number) => ({ id })),
      });
      console.log(categoriesEntities);
      product.categories = categoriesEntities;
      console.log(categoriesEntities);
    }

    const savedProduct = await productRepository.save(product);

    response.status(201).json(savedProduct);
  } catch (error) {
    response.status(500).json({ error: (error as Error).message });
  }
};

const updateProduct = async (request: Request, response: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const categoryRepository = AppDataSource.getRepository(Category);
    const productToUpdate = await productRepository.findOneBy({
      id: Number(request.params.id),
    });

    if (!productToUpdate) {
      return response
        .status(404)
        .json({ message: `Product with id ${request.params.id} not found` });
    }

    const { name, description, price, stock, categories } = request.body;
    productToUpdate.name = name ?? productToUpdate.name;
    productToUpdate.description = description ?? productToUpdate.description;
    productToUpdate.price = price ?? productToUpdate.price;
    productToUpdate.stock = stock ?? productToUpdate.stock;

    if (categories) {
      const categoriesEntities = await categoryRepository.find({
        where: categories.map((id: number) => ({ id })),
      });
      productToUpdate.categories = categoriesEntities;
      console.log(categoriesEntities);
    }

    const savedProduct = await productRepository.save(productToUpdate);

    response.status(201).json(savedProduct);
  } catch (error) {
    response.status(500).json({ error: (error as Error).message });
  }
};

const getProducts = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const repository = AppDataSource.getRepository(Product);
    const builder = repository.createQueryBuilder("product");
    if (request.query.s) {
      builder.where(`name LIKE :s`, { s: `%${request.query.s}%` });
    }

    const sort: any = request.query.sort;

    if (sort) {
      builder.orderBy(`price`, sort.toUpperCase());
    }

    const page: number = parseInt(request.query.page as any) || 1;
    const perPage: number = parseInt(request.query.perPage as any) || 9;
    const total = await builder.getCount();

    builder.offset((page - 1) * perPage).limit(perPage);

    response.json({
      data: await builder.getMany(),
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  createProduct,
  create,
  get,
  getByID,
  update,
  deleteById,
  updateProduct,
};

