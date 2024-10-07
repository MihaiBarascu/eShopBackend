import { Request } from "express";
import ImageService from "../services/ImageService";
import { AppDataSource } from "../database/data-source";
import Image from "../database/entity/Image";
import { IncomingHttpHeaders } from "http";
import Product from "../database/entity/Product";

export class ImageController {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  addImage = async (
    headers: IncomingHttpHeaders,
    fileStream: NodeJS.ReadableStream,
    location: string = "images",
    description: string = ""
  ): Promise<Image> => {
    const pictureDetails = await this.imageService.uploadPicture(
      headers,
      fileStream,
      location
    );

    return await this.imageService.saveImageNameInDatabase(pictureDetails);
  };

  getImageDetailsFromDB = async (imageId: number) => {
    return await this.imageService.getImageFromDB(imageId);
  };

  deleteImageFromMemory = async (
    imageId: number,
    location: string
  ): Promise<void> => {
    return await this.imageService.deleteImageFromMemory(imageId, location);
  };

  deleteImgFromDb = async (imageId: number): Promise<void> => {
    return await this.imageService.deleteImgFromDb(imageId);
  };
}
