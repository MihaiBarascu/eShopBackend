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

    const newImage = new Image();
    newImage.name = pictureDetails.name;
    newImage.size = pictureDetails.fileSize;
    newImage.type = pictureDetails.type;
    newImage.description = description;

    return await AppDataSource.getRepository(Image).save(newImage);
  };

  deleteImageFromMemory = async (imageId: number): Promise<void> => {
    return await this.imageService.deleteImageFromMemory(imageId);
  };

  deleteImgFromDb = async (imageId: number): Promise<void> => {
    return await this.imageService.deleteImgFromDb(imageId);
  };
}
