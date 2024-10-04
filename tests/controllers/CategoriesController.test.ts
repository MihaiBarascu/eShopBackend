import { CategoryController } from "../../src/controllers/CategoryController";
import { expectNonExistentIdError, expectError } from "../testUtils";
import {
  clearAllTables,
  populateDatabase,
} from "../database-for-tests/setupTestDatabase";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../src/dto/category.dto";
import Category from "../../src/database/entity/Category";

import { AppDataSource } from "../../src/database/data-source";
import { PaginationResponse } from "../../src/interfaces";
import { InvalidNumberError } from "../../src/errors/InvalidNumberError";
import { NotFoundError } from "../../src/errors/NotFoundError";
import { NonExistentParentIdError } from "../../src/errors/NonExistentParentId";
import { NonExistentIdError } from "../../src/errors/NonExistentIdError";
import { DeleteResult } from "typeorm";

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: require("../database-for-tests/setupTestDatabase")
    .AppDataSource,
}));

let categoryController: CategoryController;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  categoryController = new CategoryController();
  await populateDatabase(AppDataSource);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await clearAllTables(AppDataSource);
    await AppDataSource.destroy();
  }
});

describe("CategoryController", () => {
  describe("given database has 10 category entries", () => {
    describe("list categories", () => {
      describe("when limit param is 3 and offset param is 2", () => {
        it("should return a properly paginated response", async () => {
          const categList: PaginationResponse<Category> =
            await categoryController.listCategories(2, 3);

          expect(categList).toHaveProperty("data");
          expect(categList).toHaveProperty("meta");

          const categIdsToVerify = [3, 4, 5];
          const receivedCatIds = categList.data.map((categ) => categ.id);

          expect(receivedCatIds).toEqual(categIdsToVerify);

          expect(categList.meta.limit).toBe(3);
          expect(categList.meta.offset).toBe(2);
          expect(categList.meta.page).toBe(1);
        });
      });
    });
    describe("get category by id", () => {
      describe("when id is not a number", () => {
        it("should throw an InvalidNumberError", async () => {
          const invalidId = "invalid";

          await expectError(
            () => categoryController.getCatById(invalidId as any),
            InvalidNumberError
          );
        });
      });
      describe("when id is a number", () => {
        describe("and id exists in the databse", () => {
          it("should return the category", async () => {
            const validId = 1;

            const foundCateg: Category = await categoryController.getCatById(
              validId
            );
            expect(foundCateg).toHaveProperty("id", validId);
          });
        });

        describe("and id does not exists in the database", () => {
          it("should throw a NotFoundError", async () => {
            const nonExistentId = 999;

            await expectError(
              () => categoryController.getCatById(nonExistentId),
              NonExistentIdError
            );
          });
        });
      });
    });

    describe("create category", () => {
      describe("when categorydto is valid", () => {
        describe("and parentId exists in the database", () => {
          it("should create and return the category", async () => {
            const validDto: CreateCategoryDto = {
              name: "furniture",
              parentId: 3,
              isActive: true,
              description: "furniture",
            };

            const createdCat = await categoryController.create(validDto);

            expect(createdCat).toHaveProperty("name", validDto.name);
            expect(createdCat).toHaveProperty("parentId", validDto.parentId);
            expect(createdCat).toHaveProperty("id", 11);
          });
        });
        describe("and parentId does not exists in the databse", () => {
          it("should throw a NonExistentParentId", async () => {
            const validDto: CreateCategoryDto = {
              name: "furniture",
              parentId: 999,
              isActive: true,
              description: "furniture",
            };

            await expect(categoryController.create(validDto)).rejects.toThrow(
              NonExistentParentIdError
            );
          });
        });
      });
    });

    describe("update category by id", () => {
      describe("given id is a number and category dto is valid", () => {
        describe("when id is existent in the database", () => {
          it("should return updated category", async () => {
            const validDto: any = { name: "furniture2" };
            const existentId = 11;

            const updatedCategory = await categoryController.updateCategory(
              existentId,
              validDto
            );

            expect(updatedCategory).toHaveProperty("id", existentId);
            expect(updatedCategory).toHaveProperty("name", validDto.name);
          });
        });
        describe("when id is not existent in the database", () => {
          it("should throw NonExistentIdError", async () => {
            const inexitendId = 99;
            const validDto: any = { name: "furniture3" };

            await expectError(
              () => categoryController.updateCategory(inexitendId, validDto),
              NonExistentIdError
            );
          });
        });
      });
    });

    describe("delete category by id", () => {
      describe("given category id is a  number", () => {
        describe("when id exists in the databse", () => {
          it("should  delete the category", async () => {
            const existentId = 1;

            const deleteResult: DeleteResult =
              await categoryController.deleteCategoryById(existentId);

            expect(deleteResult).toHaveProperty("affected", 1);
          });
        });
        describe("when id doesn't exist in the database", () => {
          it("should throw a NonExistentIdError", async () => {
            const nonExistentId = 999;

            await expectError(
              () => categoryController.deleteCategoryById(nonExistentId),
              NonExistentIdError
            );
          });
        });
      });
    });

    describe("restore deleted category by id", () => {
      describe("given category id is a  number", () => {
        describe("when id exists in the databse", () => {
          it("should restore deleted  category", async () => {
            const existentId = 1;

            const deleteResult: DeleteResult =
              await categoryController.restoreCategoryById(existentId);

            expect(deleteResult).toHaveProperty("affected", 1);
          });
        });
        describe("when id doesn't exist in the database", () => {
          it("should throw a NonExistentIdError", async () => {
            const nonExistentId = 999;

            await expectError(
              () => categoryController.restoreCategoryById(nonExistentId),
              NonExistentIdError
            );
          });
        });
      });
    });
  });
});
