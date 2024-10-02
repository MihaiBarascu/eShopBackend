import { Router } from "express";
import imageHandler from "../handlers/imageHandler";

const imagesRouter = Router();

imagesRouter.post("/", imageHandler.addImage);

export default imagesRouter;
