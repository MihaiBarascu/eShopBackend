import { Router } from "express";

import logoutHandler from "../handlers/logoutHandler";
const logoutRouter = Router();

logoutRouter.get("/", logoutHandler);
export default logoutRouter;

