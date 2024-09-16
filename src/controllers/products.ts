import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import userHandler from "../handlers/userHandler";
import Product from "../database/entity/Product";
import productHandler from "../handlers/productHandler";
import productImagesHandler from "../handlers/productImagesHandler";
import upload from "../middlewares/fileUpload";
import { validatePictureUpload } from "../middlewares/validatePictureUpload";

const productsRouter = Router();
// router.get("/:userId", handler.getUser);
// router.get("/", handler.listUsers);
// router.get("/:userId", handler.getUser);
productsRouter.get("/", productHandler.getProducts);
productsRouter.get("/:id", productHandler.getByID);
productsRouter.post(
  "/",
  validateBodyMiddleware(CreateProductDto),
  productHandler.createProduct
);
productsRouter.post(
  "/:id/image",
  upload.array("images", 5),
  productImagesHandler.createProductImage
);

productsRouter.delete("/:id", productHandler.deleteById);
productsRouter.put(
  "/:id",
  validateBodyMiddleware(UpdateProductDto),
  productHandler.updateProduct
);

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default productsRouter;
