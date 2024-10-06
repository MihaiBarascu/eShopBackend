import { EntityManager } from "typeorm";
import { AppDataSource } from "./data-source";
import { error as logError } from "../utils/logger";

export const transactionContext = async (
  serviceMethod: (transactionManager: EntityManager) => any
) => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const data = await serviceMethod(queryRunner.manager);
    await queryRunner.commitTransaction();
    return data;
  } catch (error) {
    await queryRunner.rollbackTransaction();

    throw error;
  } finally {
    await queryRunner.release();
  }
};
