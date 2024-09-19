import jwt, { JwtPayload, Secret } from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET } from "../utils/config";
import { Request, Response, NextFunction } from "express";
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

    console.log(request.email, request.roles, request.permissions);
    next();
  });
}

