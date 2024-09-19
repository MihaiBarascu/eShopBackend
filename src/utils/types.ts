import { Request, Response, NextFunction } from "express";

export interface extendedRequest extends Request {
  email?: string;
  roles?: string[];
  permissions?: string[];
}

