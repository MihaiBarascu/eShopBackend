import { Response, NextFunction } from "express";
import { ROLES_LIST } from "../utils/config";
import { extendedRequest } from "../utils/types";

export const verifyUserIdParamMiddleware = (
  req: extendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);
    console.log("---------------", userId);
    if (!req.roles?.includes(ROLES_LIST.Admin) && req.id !== userId) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    next();
  } catch (err) {
    next(err);
  }
};
