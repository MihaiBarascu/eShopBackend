import { Request, Response, NextFunction, response } from "express";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import Product from "../database/entity/Product";
import ProductImage from "../database/entity/ProductImage";
import fs from "fs";
import path from "path";
import uploadPicture from "../utils/uploadPicture";

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
    // const productImageRepository = AppDataSource.getRepository(ProductImage);
    // const productId = req.params.id;

    // const productRepository = AppDataSource.getRepository(Product);

    // const product = await productRepository.findOneBy({
    //   id: Number(productId),
    // });
    // if (!product) {
    //   return res
    //     .status(404)
    //     .json({ message: `Product with id ${productId} not found` });
    // }

    // // checkpictures;
    // // add productImage to database
    // // add picture to folder

    // const value = await uploadPicture(req, product.id);

    const result = await uploadPicture(req, 3);

    return res.status(200).json();

    // const productImages: ProductImage[] = [];
  } catch (error) {
    next(error);
  }
};

export default { createProductImage, create, get, getByID, update, deleteById };
