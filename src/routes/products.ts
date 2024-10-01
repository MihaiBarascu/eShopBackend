import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import productHandler from "../handlers/productHandler";
import { fileMiddleWare } from "../middlewares/fileMiddleware";
import verifyJWT from "../middlewares/verifyAccessTokenMiddleware";
import { verifyRoles } from "../middlewares/verifyRolesMiddleware";
const productsRouter = Router();
productsRouter.post("/:productId/images", productHandler.addImage);

productsRouter.delete(
  "/:productId/images/:imageId",
  productHandler.removeImage
);

productsRouter.delete(
  "/:productId/images/:imageId",
  productHandler.removeImage
);
// // router.get("/:userId", handler.getUser);
// // router.get("/", handler.listUsers);
// // router.get("/:userId", handler.getUser);
productsRouter.get("/", productHandler.getProductList);
// productsRouter.get("/:id", productHandler.getByID);
productsRouter.post(
  "/",
  validateBodyMiddleware(CreateProductDto),
  productHandler.createProduct
);

productsRouter.get("/:productId", productHandler.getProductById);

productsRouter.post("/:productId/categories", productHandler.addCategory);
productsRouter.delete(
  "/:productId/categories/:categoryId",
  productHandler.removeCategory
);

productsRouter.put(
  "/:productId",
  validateBodyMiddleware(UpdateProductDto),
  productHandler.updateProduct
);

// );
// productsRouter.post("/:id/images", fileMiddleWare, productHandler.addImage);

productsRouter.delete("/:productId", productHandler.deleteProduct);
// productsRouter.put(
//   "/:id",
//   validateBodyMiddleware(UpdateProductDto),
//   productHandler.updateProduct
// );

// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default productsRouter;
