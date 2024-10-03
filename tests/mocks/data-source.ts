import { plainToInstance } from "class-transformer";
import Product from "../../src/database/entity/Product";
import { NonExistentIdError } from "../../src/errors/NonExistentIdError";

const repository = {
  findOneOrFail: jest.fn(async ({ where: { id } }) => {
    if (id === 99999) {
      throw new NonExistentIdError(`inexistetn enity for id ${id}`);
    }
    return { id } as object;
  }),
  save: jest.fn(async (entity) => ({ ...entity, id: 1 })),
  find: jest.fn(async () => [{ id: 1, name: "Test Product", images: [] }]),
  findAndCount: jest.fn(async ({ where, skip, take, relations }) => {
    const results = [{ id: 1, name: "Test Product", images: [] }];
    const total = results.length;
    return [results, total];
  }),
  softDelete: jest.fn(async (id) => {
    if (id === 99999) {
      throw new Error("Entity not found");
    }
    return { affected: 1 };
  }),
};

const AppDataSource = {
  getRepository: jest.fn(() => repository),
  initialize: jest.fn().mockResolvedValue(true),
  destroy: jest.fn().mockResolvedValue(true),
};

export { AppDataSource };
