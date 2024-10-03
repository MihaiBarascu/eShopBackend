import { AppDataSource } from "../database/data-source";
import { NotFoundError } from "../errors/NotFoundError";
import {
  EntityTarget,
  FindOptionsWhere,
  FindOptionsRelations,
  DeepPartial,
  DeleteResult,
  EntityNotFoundError,
  UpdateResult,
} from "typeorm";

import { PaginationResponse } from "../interfaces";
import { NonExistentIdError } from "../errors/NonExistentIdError";

export const getById = async <T extends object>(
  type: EntityTarget<T>,
  id: number
): Promise<T> => {
  const repository = AppDataSource.getRepository(type);
  try {
    const entity = await repository.findOneOrFail({ where: { id } as any });
    return entity;
  } catch (error) {
    throw new NotFoundError(
      `Entity of type ${type.constructor.name} with id ${id} not found`
    );
  }
};

export const simpleGet = async <T extends object>(
  type: EntityTarget<T>
): Promise<T[]> => {
  const repository = AppDataSource.getRepository(type);
  const entities = await repository.find();
  return entities;
};
export const simpleCreate = async <T extends object>(
  type: EntityTarget<T>,
  dto: DeepPartial<T>
): Promise<T> => {
  const repository = AppDataSource.getRepository(type);
  const entity = repository.create(dto);
  const savedEntity = await repository.save(entity);
  return savedEntity;
};

export const deleteById = async <T extends object>(
  type: EntityTarget<T>,
  id: number
): Promise<UpdateResult> => {
  const repository = AppDataSource.getRepository(type);

  try {
    await repository.findOneOrFail({ where: { id } as any });
  } catch (error) {
    if (
      error instanceof EntityNotFoundError &&
      error.message.includes("not find any entity of type")
    ) {
      throw new NonExistentIdError(
        `The specified ${repository.metadata.targetName} id does not exist`
      );
    }
    throw error;
  }

  return await repository.softDelete(id);
};
export const restoreById = async <T extends { id: number }>(
  type: EntityTarget<T>,
  id: number
): Promise<void> => {
  const repository = AppDataSource.getRepository(type);

  await repository.restore(id);
};

export const deleteByCriteria = async <T extends object>(
  type: EntityTarget<T>,
  searchCriteria: FindOptionsWhere<T>
): Promise<void> => {
  const repository = AppDataSource.getRepository(type);

  await repository.findOneOrFail({ where: searchCriteria });

  await repository.softDelete(searchCriteria);
};

export const get = async <T extends object>(
  type: EntityTarget<T>,
  searchCriteria: FindOptionsWhere<T> = {},
  relations: FindOptionsRelations<T> = {},
  offset: number | undefined = undefined,
  limit: number | undefined = undefined
): Promise<PaginationResponse<T>> => {
  if (offset && !limit) {
    limit = 10;
  }

  const repository = AppDataSource.getRepository(type);

  const [values, total] = await repository.findAndCount({
    where: searchCriteria || {},
    skip: offset || undefined,
    take: limit || undefined,
    relations: relations,
  });

  if (values.length == 0) {
    throw new NotFoundError("No entities found");
  }

  return {
    data: values,
    meta: {
      limit: limit ?? 0,
      offset: offset ?? 0,
      page: offset && limit ? Math.floor(offset / limit) + 1 : 1,
      total: total,
      pages: limit ? Math.ceil(total / limit) : 0,
    },
  };
};
