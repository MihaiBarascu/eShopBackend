import { MAX_FILE_SIZE } from "../utils/config";
import { Request, Response, NextFunction } from "express";

export const fileMiddleWare = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const length = Number(request.headers["content-length"]) || 0;

  if (!length) {
    return response
      .status(400)
      .json({ message: "Please add 'content-length' header in request" });
  }

  if (length > MAX_FILE_SIZE) {
    return response.status(413).json({
      message: `Max file size exceeded ${length} > ${MAX_FILE_SIZE} (bytes)`,
    });
  }

  next();
};

export default {
  fileMiddleWare,
};

