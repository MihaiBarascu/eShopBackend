import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import Order from "../database/entity/Order";

const get = shared.get(Order);
const deleteById = shared.deleteById(Order);
const getByID = shared.getByID(Order);
const create = shared.create(Order);
const update = shared.update(Order);

export default { create, get, getByID, update, deleteById };

