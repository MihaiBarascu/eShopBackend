import fs from "fs";
import path from "path";
import busboy from "busboy";
import { Request } from "express";
import { IncomingHttpHeaders } from "http";
import { MAX_FILE_SIZE } from "./config";
import { info as logInfo, error as logError } from "./logger";

export default function uploadPicture(
  req: Request,
  productId: number
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const headers = req.headers as IncomingHttpHeaders;

    const bb = busboy({ headers });
    let fileSize = 0;
    let isError = false;

    const uploadDir = path.join(
      __dirname,
      `../../uploads/products/${productId}`
    );

    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      logError("Failed to create upload directory", err);
      return reject(false);
    }

    bb.on("file", (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      logInfo(
        `File [${name}] : filename : %j, encoding: %j, mimeType: %j`,
        filename,
        encoding,
        mimeType
      );

      const saveTo = path.join(uploadDir, `${Date.now()}-${filename}`);
      const writeStream = fs.createWriteStream(saveTo);

      writeStream.on("error", (err) => {
        logError(`Error writing file [${name}]`, err);
        isError = true;
        file.destroy();
        reject(err);
      });

      file.on("data", (data) => {
        fileSize += data.length;
        logInfo(`File [${name}] got ${data.length} bytes`);

        if (fileSize > MAX_FILE_SIZE) {
          logError(`File [${name}] exceeds the maximum size of 5MB`);
          isError = true;
          file.destroy();
          writeStream.destroy();
          reject(new Error(`File [${name}] exceeds the maximum size of 5MB`));
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
      if (isError) {
        logError("File upload failed");
        resolve(false);
      } else {
        logInfo("Finished parsing form");
        resolve(true);
      }
    });

    req.pipe(bb);
  });
}

