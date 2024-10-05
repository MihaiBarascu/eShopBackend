import { RoleController } from "../../src/controllers/RoleController";
import { expectNonExistentIdError, expectError } from "../testUtils";
import {
  clearAllTables,
  populateDatabase,
} from "../database-for-tests/setupTestDatabase";
import { CreateRoleDto, UpdateRoleDto } from "../../src/dto/role.dto";
import { Role } from "../../src/database/entity/Role";
import { AppDataSource } from "../../src/database/data-source";
import { PaginationResponse } from "../../src/interfaces";
import { NotFoundError } from "../../src/errors/NotFoundError";
import { NonExistentIdError } from "../../src/errors/NonExistentIdError";
import { DeleteResult, UpdateResult } from "typeorm";

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: require("../database-for-tests/setupTestDatabase")
    .AppDataSource,
}));

let roleController: RoleController;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  roleController = new RoleController();
  await populateDatabase(AppDataSource);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await clearAllTables(AppDataSource);
    await AppDataSource.destroy();
  }
});

describe("RoleController", () => {
  describe("given database has multiple role entries", () => {
    describe("list roles", () => {
      describe("when limit param is 2 and offset param is 1", () => {
        it("should return a properly paginated response", async () => {
          const roleList: PaginationResponse<Role> =
            await roleController.listRoles(1, 2);

          expect(roleList).toHaveProperty("data");
          expect(roleList).toHaveProperty("meta");

          const roleIdsToVerify = [2, 3];
          const receivedRoleIds = roleList.data.map((role) => role.id);

          expect(receivedRoleIds).toEqual(roleIdsToVerify);

          expect(roleList.meta.limit).toBe(2);
          expect(roleList.meta.offset).toBe(1);
          expect(roleList.meta.page).toBe(1);
        });
      });
    });

    describe("get role by id", () => {
      describe("when id exists in the database", () => {
        it("should return the role", async () => {
          const validId = 1;

          const foundRole: Role = await roleController.getRoleById(validId);
          expect(foundRole).toHaveProperty("id", validId);
        });
      });

      describe("when id does not exist in the database", () => {
        it("should throw a NotFoundError", async () => {
          const nonExistentId = 999;

          await expectError(
            () => roleController.getRoleById(nonExistentId),
            NonExistentIdError
          );
        });
      });
    });

    describe("create role", () => {
      describe("when roleDto is valid", () => {
        it("should create and return the role", async () => {
          const validDto: CreateRoleDto = {
            name: "admin",
            description: "Administrator role",
          };

          const createdRole = await roleController.create(validDto);

          expect(createdRole).toHaveProperty("name", validDto.name);
          expect(createdRole).toHaveProperty(
            "description",
            validDto.description
          );
        });
      });
    });

    describe("update role by id", () => {
      describe("given id is a number and role dto is valid", () => {
        describe("when id exists in the database", () => {
          it("should return updated role", async () => {
            const validDto: UpdateRoleDto = { name: "admin2" };
            const existentId = 1;

            const updatedRole = await roleController.updateRole(
              existentId,
              validDto
            );

            expect(updatedRole).toHaveProperty("id", existentId);
            expect(updatedRole).toHaveProperty("name", validDto.name);
          });
        });
        describe("when id does not exist in the database", () => {
          it("should throw NonExistentIdError", async () => {
            const inexistentId = 99;
            const validDto: UpdateRoleDto = { name: "admin3" };

            await expectError(
              () => roleController.updateRole(inexistentId, validDto),
              NonExistentIdError
            );
          });
        });
      });
    });

    describe("delete role by id", () => {
      describe("given role id is a number", () => {
        describe("when id exists in the database", () => {
          it("should delete the role", async () => {
            const existentId = 1;

            const deleteResult: UpdateResult =
              await roleController.deleteRoleById(existentId);
            expect(deleteResult).toHaveProperty("affected", 1);
          });
        });
        describe("when id doesn't exist in the database", () => {
          it("should throw a NonExistentIdError", async () => {
            const nonExistentId = 999;

            await expectError(
              () => roleController.deleteRoleById(nonExistentId),
              NonExistentIdError
            );
          });
        });
      });
    });

    describe("restore deleted role by id", () => {
      describe("given role id is a number", () => {
        describe("when id exists in the database", () => {
          it("should restore deleted role", async () => {
            const existentId = 1;

            const deleteResult: DeleteResult =
              await roleController.restoreRoleById(existentId);

            expect(deleteResult).toHaveProperty("affected", 1);
          });
        });
        describe("when id doesn't exist in the database", () => {
          it("should throw a NonExistentIdError", async () => {
            const nonExistentId = 999;

            await expectError(
              () => roleController.restoreRoleById(nonExistentId),
              NonExistentIdError
            );
          });
        });
      });
    });
  });
});

