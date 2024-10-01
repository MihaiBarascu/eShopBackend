import { Request, Response, NextFunction } from "express";

interface ValidationFields {
  params?: { [key: string]: string };
  body?: { [key: string]: string };
}

export const validateFields = (
  req: Request,

  fields: ValidationFields
) => {
  if (fields.params) {
    for (const [paramName, paramValue] of Object.entries(fields.params)) {
      const value = Number(req.params[paramValue]);
      if (isNaN(value) || value <= 0) {
        throw new Error(`${paramName} param is invalid or undefined`);
      }
    }
  }

  if (fields.body) {
    for (const [fieldName, fieldValue] of Object.entries(fields.body)) {
      const value = Number(req.body[fieldValue]);
      if (isNaN(value) || value <= 0) {
        throw new Error(`${fieldName} field from body is invalid or undefined`);
      }
    }
  }
};
