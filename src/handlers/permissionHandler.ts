import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import { Permission } from "../database/entity/Permission";

const get = shared.get(Permission);
const deleteById = shared.deleteById(Permission);
const getByID = shared.getByID(Permission);
const create = shared.create(Permission);
const update = shared.update(Permission);

export default { create, get, getByID, update, deleteById };

