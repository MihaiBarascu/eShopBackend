import { Request, Response, NextFunction } from "express";

export interface extendedRequest extends Request {
  email?: string;
  roles?: number[];
  permissions?: string[];
  id?: number;
  uuid?: string;
}
