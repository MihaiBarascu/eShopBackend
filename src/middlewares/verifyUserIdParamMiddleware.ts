import { Response, NextFunction } from "express";
import { ROLES_LIST } from "../utils/config";
import { extendedRequest } from "../utils/types";

export const verifyUuidParamMiddleware = (
  req: extendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.params.uuid);
    console.log("-----------");
    console.log(req.uuid);
    const uuid = req.params.uuid;
    if (!req.roles?.includes(ROLES_LIST.Admin) && req.uuid !== uuid) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    next();
  } catch (err) {
    next(err);
  }
};
