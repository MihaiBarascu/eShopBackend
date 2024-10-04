import { NonExistentIdError } from "../errors/NonExistentIdError";
import { EntityNotFoundError, Repository, ObjectLiteral } from "typeorm";

const findOneOrFailTreated = async <T extends ObjectLiteral>(
  repository: Repository<T>,
  id: number
): Promise<T> => {
  try {
    return await repository.findOneOrFail({ where: { id } as any });
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
};

export default findOneOrFailTreated;
