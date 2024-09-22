// import { Request, Response, NextFunction } from "express";
// import { AppDataSource } from "../database/data-source";
// import Product from "../database/entity/Product";

// const validatePictureUpload = async (
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) => {
//   try {
//     const productRepository = AppDataSource.getRepository(Product);
//     const product = await productRepository.exists({
//       where: { id: Number(request.params.id) },
//     });

//     if (!product) {
//       return response
//         .status(404)
//         .json({ message: `Product with id ${request.params.id} not found` });
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// export { validatePictureUpload };
