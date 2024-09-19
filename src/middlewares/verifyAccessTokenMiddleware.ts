import jwt, { JwtPayload, Secret } from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET } from "../utils/config";
import { info } from "../utils/logger";
import { Request, Response, NextFunction } from "express";

interface extendedRequest extends Request {
  userInfo?: object;
}

export default function verifyJWT(
  request: extendedRequest,
  response: Response,
  next: NextFunction
) {
  if (!ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET not found");

  const authHeader = request.headers["authorization"];
  if (!authHeader) return response.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return response.sendStatus(403);
    request.userInfo = (decoded as JwtPayload).userInfo;
    next();
  });
}

