import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto";

import categoryHandler from "../handlers/categoryHandler";

import verifyAccessToken from "../middlewares/verifyAccessTokenMiddleware";
import { verifyRoles } from "../middlewares/verifyRolesMiddleware";
import { ROLES_LIST } from "../utils/config";
const categoriesRouter = Router();

categoriesRouter.get("/generate-tree", categoryHandler.getTree);
categoriesRouter.get("/generate-html-list", categoryHandler.getHtmlList);

categoriesRouter.get("/:categoryId", categoryHandler.getCategoryById);
categoriesRouter.get("/", categoryHandler.getCategoryList);

categoriesRouter.use(verifyAccessToken);

categoriesRouter.post(
  "/",
  verifyRoles(ROLES_LIST.Admin),
  validateBodyMiddleware(CreateCategoryDto),
  categoryHandler.create
);

categoriesRouter.put(
  "/:categoryId",
  verifyRoles(ROLES_LIST.Admin),
  validateBodyMiddleware(UpdateCategoryDto),
  categoryHandler.updateCategory
);
categoriesRouter.delete(
  "/:categoryId",
  verifyRoles(ROLES_LIST.Admin),
  categoryHandler.deleteCategory
);

export default categoriesRouter;
