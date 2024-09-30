// import { Request, Response, NextFunction, response } from "express";
// import { AppDataSource } from "../database/data-source";
// import shared from "./shared";
// import Product from "../database/entity/Product";
// import ProductImage from "../database/entity/Image";
// import fs from "fs";
// import path from "path";
// import uploadPicture from "../utils/uploadImage";

// const get = shared.get(ProductImage);
// const deleteById = shared.deleteById(ProductImage);
// const getByID = shared.getByID(ProductImage);
// const create = shared.create(ProductImage);
// const update = shared.update(ProductImage);

// const createProductImage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const productImageRepository = AppDataSource.getRepository(ProductImage);
//     const productId = req.params.id;

//     const productRepository = AppDataSource.getRepository(Product);

//     const product = await productRepository.findOneBy({
//       id: Number(productId),
//     });
//     if (!product) {
//       return res
//         .status(404)
//         .json({ message: `Product with id ${productId} not found` });
//     }

//     const productImageDetails = new ProductImage();
//     productImageDetails.description = req.body.description;

//     const details = await uploadPicture(req, `products/${productId}`);

//     productImageDetails.name = details.name;
//     productImageDetails.size = details.fileSize;
//     productImageDetails.type = details.type;

//     const result = await productImageRepository.save(productImageDetails);

//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export default { createProductImage, create, get, getByID, update, deleteById };

// //trimit id produs
// //dupa ce le organizez shimb id cu unic id
