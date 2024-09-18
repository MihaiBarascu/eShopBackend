import fs from "fs";
import path from "path";
import busboy from "busboy";
import { Request } from "express";
import { IncomingHttpHeaders } from "http";
import { MAX_FILE_SIZE } from "./config";
import { info as logInfo, error as logError } from "./logger";

interface PictureDetails {
  fileSize: number;
  type: string;
  name: string;
}

export default async function uploadPicture(
  req: Request,
  directory: string
): Promise<PictureDetails> {
  const headers = req.headers as IncomingHttpHeaders;

  const pictureDetails: PictureDetails = {
    fileSize: 0,
    type: "",
    name: "",
  };

  const bb = busboy({ headers });

  let isError = false;
  let fileProcessed = false;

  const uploadDir = path.join(__dirname, `../../uploads/${directory}`);

  try {
    await fs.promises.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    logError("Failed to create directory", err);
    throw new Error(`Failed to create directory: ${uploadDir}`);
  }

  return new Promise((resolve, reject) => {
    bb.on("file", (name, file, info) => {
      if (fileProcessed) {
        logError(`Multiple files are not allowed. File[${name}] rejected`);
        file.destroy();
      }

      fileProcessed = true;

      const { filename, encoding, mimeType } = info;

      logInfo(
        `File [${name}] : filename : %j, encoding: %j, mimeType: %j`,
        filename,
        encoding,
        mimeType
      );

      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedMimeTypes.includes(mimeType)) {
        logError(`File [${name}] has an invalid mime type: ${mimeType}`);
        isError = true;
        file.destroy();
        return reject(new Error(`Invalid file type: ${mimeType}`));
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
      if (isError) {
        logError("File upload failed");
        reject(new Error("File upload failed"));
      } else {
        logInfo("Finished parsing form");
        resolve(pictureDetails);
      }
    });

    req.pipe(bb);
  });
}
