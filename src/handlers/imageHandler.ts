import { Request, Response, NextFunction } from "express";
import { ImageController } from "../controllers/ImageController";
import { IncomingHttpHeaders } from "http";

class ImageHandler {
  private imageController: ImageController;

  constructor() {
    this.imageController = new ImageController();
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

  deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(this.imageController.deleteImageFromMemory(1));
    } catch (error) {
      next(error);
    }
  };
}

const imageHandler = new ImageHandler();
export default imageHandler;
