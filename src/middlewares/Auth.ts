/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { User } from "../database/entity/User";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
  email: string;
  exp: number;
  iat: number;
  user: User;
  [x: string]: any;
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const SECRET_KEY: Secret = process.env.JWT_SECRET ?? "";
  if (SECRET_KEY === "") {
    throw new Error("Secret key not found");
  }

  try {
    if (req.headers["public"] && req.headers["public"] === "true") {
      next();
      return;
    }
    if (authHeader) {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        return res.sendStatus(403);
      }

      const decoded = jwt.verify(token, SECRET_KEY);
      (req as CustomRequest).token = decoded;
      (req as CustomRequest).email = (decoded as JwtPayload).email;
      (req as CustomRequest).exp = (decoded as JwtPayload).exp as number;
      (req as CustomRequest).iat = (decoded as JwtPayload).iat as number;
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    res.status(401).send("Please authenticate");
  }
};

const isPublic = (req: Request, res: Response, next: NextFunction) => {
  req.headers["public"] = "true";
  next();
};

export default authenticateJWT;
export { isPublic };
