import { EntityManager } from "typeorm";
import { AppDataSource } from "./data-source";

export const transactionContext = async (
  serviceMethod: (transactionManager: EntityManager) => any
) => {
  /*
https://blog.bitsrc.io/build-a-reliable-node-api-with-typeorm-using-transactions-3d0561e0c953
  */
};
