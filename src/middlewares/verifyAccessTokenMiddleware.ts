import jwt, { JwtPayload } from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET } from "../utils/config";
import { Response, NextFunction } from "express";
import { extendedRequest } from "../utils/types";

export default function verifyJWT(
  request: extendedRequest,
  response: Response,
  next: NextFunction
) {
  if (!ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET not found");

  const authHeader =
    request.headers.authorization || request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return response.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return response.sendStatus(403);
    request.email = (decoded as JwtPayload).UserInfo.email;
    request.roles = (decoded as JwtPayload).UserInfo.roles;
    request.permissions = (decoded as JwtPayload).UserInfo.permissions;
    request.id = (decoded as JwtPayload).UserInfo.id;
    request.uuid = (decoded as JwtPayload).UserInfo.uuid;
    console.log(request.email, request.roles, request.permissions, request.id);
    next();
  });
}

//password reset
