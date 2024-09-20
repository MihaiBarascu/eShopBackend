import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import userHandler from "../handlers/userHandler";
import ProductImage from "../database/entity/ProductImage";
import productImagesHandler from "../handlers/productImagesHandler";
import upload from "./UNUSED-fileUpload";
import { validatePictureUpload } from "./UNUSED-validatePictureUpload";

const productImagesRouter = Router();
// router.get("/:userId", handler.getUser);
// router.get("/", handler.listUsers);
// router.get("/:userId", handler.getUser);
productImagesRouter.get("/", productImagesHandler.get);
productImagesRouter.get("/:id", productImagesHandler.getByID);
productImagesRouter.post("/:id", productImagesHandler.createProductImage);
productImagesRouter.delete("/:id", productImagesHandler.deleteById);
productImagesRouter.put(
  "/:id",

  productImagesHandler.update
);

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default productImagesRouter;
