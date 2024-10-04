import { Router } from "express";
import imageHandler from "../handlers/imageHandler";
import express from "express";
import path from "path";

const imagesRouter = Router();

imagesRouter.get("/:imageId", imageHandler.getImageDetails);
imagesRouter.use(
  "/static",
  express.static(path.join(__dirname, "../../uploads/images/"))
);

imagesRouter.post("/", imageHandler.addImage);

export default imagesRouter;
