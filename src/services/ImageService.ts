import fs from "fs";
import path from "path";
import busboy from "busboy";
import { IncomingHttpHeaders } from "http";
import { MAX_FILE_SIZE } from "../utils/config";
import {
  info as logInfo,
  error as logError,
  warn as logWarn,
} from "../utils/logger";
import { AppDataSource } from "../database/data-source";
import Image from "../database/entity/Image";
import { deleteById, getById } from "../shared/repositoryMethods";

interface PictureDetails {
  fileSize: number;
  type: string;
  name: string;
}

class ImageService {
  private allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

  verifyImageExtension = (filename: string) => {
    if (
      filename.endsWith(".png") ||
      filename.endsWith(".jpg") ||
      filename.endsWith(".jpeg")
    ) {
      return true;
    }
    return false;
  };

  saveImageNameInDatabase = async (pictureDetails) => {
    const newImage = new Image();
    newImage.name = pictureDetails.name;
    newImage.size = pictureDetails.fileSize;
    newImage.type = pictureDetails.type;

    return await AppDataSource.getRepository(Image).save(newImage);
  };

  getImageFromDB = async (imageId: number) => {
    return await getById(Image, imageId);
  };

  async createUploadDir(location: string): Promise<string> {
    let uploadDir;
    try {
      uploadDir = path.join(__dirname, "../../uploads", location);
      await fs.promises.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      logError("Failed to create directory", err);
      throw new Error(`Failed to create directory: ${location}`);
    } finally {
      return uploadDir;
    }
  }

  validateMimeType(mimeType: string, name: string): void {
    if (!this.allowedMimeTypes.includes(mimeType)) {
      logError(`File [${name}] has an invalid mime type: ${mimeType}`);
      throw new Error(`Invalid file type: ${mimeType}`);
    }
  }

  async uploadPicture(
    headers: IncomingHttpHeaders,
    fileStream: NodeJS.ReadableStream,
    location: string
  ): Promise<PictureDetails> {
    const pictureDetails: PictureDetails = {
      fileSize: 0,
      type: "",
      name: "",
    };

    const bb = busboy({ headers });
    let isError = false;
    let fileProcessed = false;

    const uploadDir = await this.createUploadDir(location);

    return new Promise((resolve, reject) => {
      bb.on("file", (name, file, info) => {
        console.log("File event started");
        if (fileProcessed) {
          logWarn(`Multiple files are not allowed. ${info.filename} rejected`);
          file.resume();
          return;
        }
        fileProcessed = true;

        let { filename, encoding, mimeType } = info;

        filename = filename.replace(/\s+/g, "-");

        logInfo(
          `File [${name}] : filename : %j, encoding: %j, mimeType: %j`,
          filename,
          encoding,
          mimeType
        );

        try {
          this.validateMimeType(mimeType, name);
        } catch (err) {
          isError = true;
          file.destroy();
          return reject(err);
        }

        pictureDetails.type = mimeType;
        pictureDetails.name = `${Date.now()}-${filename}`;
        const saveTo = path.join(uploadDir, pictureDetails.name);
        const writeStream = fs.createWriteStream(saveTo);

        writeStream.on("error", (err) => {
          logError(`Error writing file [${name}]`, err);
          isError = true;
          file.destroy();
          fs.promises.unlink(saveTo).catch((unlinkErr) => {
            logError(`Failed to remove incomplete file [${name}]`, unlinkErr);
          });
          reject(err);
        });

        file.on("data", (data) => {
          pictureDetails.fileSize += data.length;
          logInfo(`File [${name}] got ${data.length} bytes`);

          if (pictureDetails.fileSize > MAX_FILE_SIZE) {
            logError(
              `File [${name}] exceeds the maximum size of ${MAX_FILE_SIZE} bytes`
            );
            isError = true;
            file.destroy();
            writeStream.destroy();
            reject(
              new Error(
                `File [${name}] exceeds the maximum size of ${MAX_FILE_SIZE} bytes`
              )
            );
          }
        });

        file.on("end", () => {
          if (!isError) {
            logInfo(`File [${name}] fully received`);
          }
        });

        writeStream.on("close", () => {
          if (!isError) {
            logInfo(`File [${name}] saved successfully`);
          }
        });

        if (!isError) {
          file.pipe(writeStream);
        }
      });

      bb.on("field", (name, val, info) => {
        logInfo(`Field [${name}]: value: %j`, val);
      });

      bb.on("close", () => {
        console.log("Busboy close event");
        if (isError) {
          logError("File upload failed");
          reject(new Error("File upload failed"));
        } else {
          resolve(pictureDetails);
        }
      });

      fileStream.pipe(bb);
    });
  }

  async addImage(
    headers: IncomingHttpHeaders,
    fileStream: NodeJS.ReadableStream,
    location: string = "images",
    description: string = ""
  ): Promise<Image> {
    console.log("addImage started");
    const newImage = new Image();

    const details = await this.uploadPicture(headers, fileStream, location);

    newImage.name = details.name;
    newImage.size = details.fileSize;
    newImage.type = details.type;
    newImage.description = description;

    console.log("addImage finished");
    return await AppDataSource.getRepository(Image).save(newImage);
  }

  async deleteImageFromMemory(
    imageId: number,
    location: string = "images"
  ): Promise<void> {
    try {
      const foundImage = await getById(Image, imageId);

      const deletePath = path.join(
        __dirname,
        `../../uploads/${location}`,
        foundImage.name
      );

      await fs.promises.unlink(deletePath);
      logInfo(`Image at path ${deletePath} deleted successfully`);
    } catch (err) {
      logError(`Failed to delete image with id ${imageId}`, err);
      throw new Error(`Failed to delete with id ${imageId}`);
    }
  }

  async deleteImgFromDb(imageId: number): Promise<void> {
    await deleteById(Image, imageId);
  }
}

export default ImageService;
