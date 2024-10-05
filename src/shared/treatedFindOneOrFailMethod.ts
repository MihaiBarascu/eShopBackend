import { NonExistentIdError } from "../errors/NonExistentIdError";
import { EntityNotFoundError, Repository, ObjectLiteral } from "typeorm";
import { FindOptionsRelations } from "typeorm";
const findOneOrFailTreated = async <T extends ObjectLiteral>(
  repository: Repository<T>,
  id: number,
  relations?: FindOptionsRelations<T>
): Promise<T> => {
  try {
    return await repository.findOneOrFail({
      where: { id } as any,
      relations: relations ?? {},
    });
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

