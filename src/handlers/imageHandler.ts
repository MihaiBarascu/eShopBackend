import { Request, Response, NextFunction } from "express";
import { ImageController } from "../controllers/ImageController";
import { IncomingHttpHeaders } from "http";
import { validateFields } from "../shared/utils";
import ImageService from "../services/ImageService";

class ImageHandler {
  private imageController: ImageController;
  private imageService: ImageService;

  constructor() {
    this.imageController = new ImageController();
    this.imageService = new ImageService();
  }

  addImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const headers = req.headers as IncomingHttpHeaders;

      const result = await this.imageController.addImage(headers, req);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getImageDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      validateFields(req, { params: { imageId: "imageId" } });

      const imageId = Number(req.params.imageId);

      res
        .status(200)
        .json(await this.imageController.getImageDetailsFromDB(imageId));
    } catch (error) {
      next(error);
    }
  };
}

const imageHandler = new ImageHandler();
export default imageHandler;
