import { Router } from "express";

import { validateBodyMiddleware } from "../middlewares/validationMiddleware";
import { registerHandler } from "../handlers/registerHandler";
import { CreateUserDto } from "../dto/user.dto";
const registerRouter = Router();

registerRouter.post(
  "/",
  validateBodyMiddleware(CreateUserDto),
  registerHandler
);

export default registerRouter;

