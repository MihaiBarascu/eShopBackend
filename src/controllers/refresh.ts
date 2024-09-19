import { Router } from "express";


import refreshTokenHandler from "../handlers/refreshTokenHandler";
const refreshTokenRouter = Router();

refreshTokenRouter.get("/", refreshTokenHandler);
export default refreshTokenRouter;

