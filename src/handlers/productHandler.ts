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
    const { name, description, price, categories } = request.body;

    const product = new Product();
    product.name = name;
    product.description = description;
    product.price = price;

    if (categories) {
      const categoriesEntities = await categoryRepository.find({
        where: categories.map((id: number) => ({ id })),
      });
      product.category = categoriesEntities;
      console.log(categoriesEntities);
    }

    const savedProduct = await productRepository.save(product);

    response.status(201).json(savedProduct);
  } catch (error) {
    response.status(500).json({ error: (error as Error).message });
  }
};

export default { createProduct, create, get, getByID, update, deleteById };

