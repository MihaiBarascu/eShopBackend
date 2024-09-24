import { AppDataSource } from "../database/data-source";
import { EntityTarget, FindOptionsWhere, FindOptionsRelations } from "typeorm";

import { PaginationResponse } from "../interfaces";

export const simpleGet = async <T extends object>(
  type: EntityTarget<T>
): Promise<T[]> => {
  const repository = AppDataSource.getRepository(type);
  const entities = await repository.find();
  return entities;
};

export const deleteById = async <T extends object>(
  type: EntityTarget<T>,
  id: number
): Promise<void> => {
  const repository = AppDataSource.getRepository(type);

  await repository.findOneOrFail({ id: id } as any);

  await repository.softDelete({ id: id } as any);
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
  offset: number | undefined = undefined,
  limit: number | undefined = undefined,
  searchCriteria: FindOptionsWhere<T> = {},
  relations: FindOptionsRelations<T> = {}
): Promise<PaginationResponse<T>> => {
  const repository = AppDataSource.getRepository(type);

  const [values, total] = await repository.findAndCount({
    where: searchCriteria || {},
    skip: offset || undefined,
    take: limit || undefined,
    relations: relations,
  });

  if (values.length == 0) {
    throw new Error("No entities found");
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
