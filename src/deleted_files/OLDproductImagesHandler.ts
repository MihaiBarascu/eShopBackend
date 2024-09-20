import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import shared from "../handlers/shared";
import Product from "../database/entity/Product";
import ProductImage from "../database/entity/ProductImage";
import fs from "fs";
import path from "path";

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

    const picturesToUpload = req.files as Express.Multer.File[] | undefined;

    if (!picturesToUpload || picturesToUpload.length === 0) {
      return res.status(400).json({ message: `Picture to upload not found` });
    }

    const productImages: ProductImage[] = [];

    for (const picture of picturesToUpload) {
      const uploadDir = path.join(
        __dirname,
        `../../uploads/products/${product.id}`
      );
      const picturePath = path.join(uploadDir, picture.filename);

      await fs.promises.mkdir(uploadDir, { recursive: true });

      await fs.promises.rename(picture.path, picturePath);

      const productImage = new ProductImage();
      productImage.name = picture.filename;
      productImage.size = picture.size;
      productImage.type = picture.mimetype;
      productImage.product = product;
      productImages.push(productImage);
    }

    const savedProductImages = await productImageRepository.save(productImages);
    return res.status(201).json({ savedProductImages });
  } catch (error) {
    next(error);
  }
};

export default { createProductImage, create, get, getByID, update, deleteById };
