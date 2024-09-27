import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto";
import userHandler from "../handlers/userHandler";
import Product from "../database/entity/Product";
import categoryHandler from "../handlers/categoryHandler";
import Category from "../database/entity/Category";
const categoriesRouter = Router();
// router.get("/:userId", handler.getUser);
// router.get("/", handler.listUsers);
// router.get("/:userId", handler.getUser);
categoriesRouter.get("/generate-tree", categoryHandler.getTree);
categoriesRouter.get("/generate-html-list", categoryHandler.getHtmlList);

categoriesRouter.get("/:categoryId", categoryHandler.getCategoryById);
categoriesRouter.get("/", categoryHandler.getCategoryList);
categoriesRouter.post(
  "/",
  validateBodyMiddleware(CreateCategoryDto),
  categoryHandler.create
);

categoriesRouter.put(
  "/:categoryId",
  validateBodyMiddleware(UpdateCategoryDto),
  categoryHandler.updateCategory
);
categoriesRouter.delete("/:categoryId", categoryHandler.deleteCategory);
// router.delete("/:userId", handler.deleteUser);
// router.post("/:userId/roles/:roleId", handler.addRole);
// router.delete("/:userId/roles/:roleId", handler.removeRole);
// router.get("/:userId/orders", handler.listOrders);
// router.get("/:userId/orders/:orderId", handler.getOrder);
export default categoriesRouter;
