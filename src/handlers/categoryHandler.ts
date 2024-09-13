import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import Product from "../database/entity/Product";
import Category from "../database/entity/Category";

const get = shared.get(Category);
const deleteById = shared.deleteById(Category);
const getByID = shared.getByID(Category);
const create = shared.create(Category);
const update = shared.update(Category);

export default { create, get, getByID, update, deleteById };

