import { Request, Response, NextFunction } from "express";
import { extendedRequest } from "../utils/types";

export const verifyRoles = (...allowedRoles: number[]) => {
  return (req: extendedRequest, res: Response, next: NextFunction) => {
    if (!req?.roles) {
      return res.sendStatus(403);
    }
    const rolesArray: number[] = [...allowedRoles];

    const result = req.roles
      .map((role) => rolesArray.includes(Number(role)))
      .find((val) => val === true);
    if (!result) {
      return res.sendStatus(403);
    }
    next();
  };
};
