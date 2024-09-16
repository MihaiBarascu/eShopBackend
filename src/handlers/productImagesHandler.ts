import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import Product from "../database/entity/Product";
import ProductImage from "../database/entity/ProductImage";

const get = shared.get(ProductImage);
const deleteById = shared.deleteById(ProductImage);
const getByID = shared.getByID(ProductImage);
const create = shared.create(ProductImage);
const update = shared.update(ProductImage);

const createProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productImageRepository = AppDataSource.getRepository(ProductImage);
    const productId = req.params.id;

    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOneBy({
      id: Number(productId),
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product with id ${productId} not found` });
    }

    if (!req.file) {
      return res.status(404).json({ message: `Picture to upload not found` });
    }
    const productImage = new ProductImage();
    productImage.name = req.file.filename;
    productImage.size = req.file.size;
    productImage.type = req.file.mimetype;
    productImage.product = product;
    const savedProductImage = await productImageRepository.save(productImage);
    return res.status(201).json(savedProductImage);
  } catch (error) {
    next(error);
  }
};

export default { createProductImage, create, get, getByID, update, deleteById };

