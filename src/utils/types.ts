import { Request, Response, NextFunction } from "express";

export interface extendedRequest extends Request {
  email?: string;
  roles?: number[];
  id?: number;
  uuid?: string;
}
