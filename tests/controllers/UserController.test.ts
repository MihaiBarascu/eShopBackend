import { UserController } from "../../src/controllers/UserController";
import { expectNonExistentIdError, expectError } from "../testUtils";
import {
  clearAllTables,
  populateDatabase,
} from "../database-for-tests/setupTestDatabase";
import { CreateUserDto, UpdateUserDto } from "../../src/dto/user.dto";
import { User } from "../../src/database/entity/User";
import { AppDataSource } from "../../src/database/data-source";
import { PaginationResponse } from "../../src/interfaces";
import { NonExistentIdError } from "../../src/errors/NonExistentIdError";
import { DeleteResult, UpdateResult } from "typeorm";
import { DuplicateMemberError } from "../../src/errors/DuplicateMemberError";
import { MissingMemberError } from "../../src/errors/MissingMemberError";
import Order from "../../src/database/entity/Order";
import { CreateUserOrderDto } from "../../src/dto/userOrder.dto";
import SanitizedOrder from "../../src/serializers/order";
import { NotFoundError } from "../../src/errors/NotFoundError";

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: require("../database-for-tests/setupTestDatabase")
    .AppDataSource,
}));

let userController: UserController;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  userController = new UserController();
  await populateDatabase(AppDataSource);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await clearAllTables(AppDataSource);
    await AppDataSource.destroy();
  }
});

describe("UserController", () => {
  describe("given database has multiple user entries", () => {
    describe("list users", () => {
      describe("when limit param is 3 and offset param is 2", () => {
        it("should return a properly paginated response", async () => {
          const userList: PaginationResponse<User> =
            await userController.listUsers(2, 3);

          expect(userList).toHaveProperty("data");
          expect(userList).toHaveProperty("meta");

          const userIdsToVerify = [3, 4, 5];
          const receivedUserIds = userList.data.map((user) => user.id);

          expect(receivedUserIds).toEqual(userIdsToVerify);

          expect(userList.meta.limit).toBe(3);
          expect(userList.meta.offset).toBe(2);
          expect(userList.meta.page).toBe(1);
        });
      });
    });

    describe("get user by id", () => {
      describe("given id is a number", () => {
        describe("when id doesn't exist in the database", () => {
          it("should throw a NonExistentIdError", async () => {
            const inexistentId = 9999;

            await expectError(
              () => userController.getUser(inexistentId),
              NonExistentIdError
            );
          });
        });
        describe("when id exists in the database", () => {
          it("should return found user", async () => {
            const existentId = 1;

            const foundUser = await userController.getUser(existentId);

            expect(foundUser).toHaveProperty("id", existentId);
          });
        });
      });
    });
  });

  describe("create user", () => {
    describe("when userDto is valid", () => {
      it("should create and return the user", async () => {
        const validDto: CreateUserDto = {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe2@example.com",
          password: "password123",
        };

        const createdUser = await userController.createUser(validDto);

        expect(createdUser).toHaveProperty("firstName", validDto.firstName);
        expect(createdUser).toHaveProperty("lastName", validDto.lastName);
        expect(createdUser).toHaveProperty("email", validDto.email);
      });
    });
  });

  describe("update user by uuid", () => {
    describe("given uuid is a string and user dto is valid", () => {
      describe("when uuid exists in the database", () => {
        it("should return updated user", async () => {
          const validDto: Partial<UpdateUserDto> = {
            firstName: "UpdatedName",
          };
          const existentUuid = "some-uuid";

          const updatedUser = await userController.updateUser(
            existentUuid,
            validDto as UpdateUserDto
          );

          expect(updatedUser).toHaveProperty("uuid", existentUuid);
          expect(updatedUser).toHaveProperty("firstName", validDto.firstName);
        });
      });

      describe("when uuid does not exist in the database", () => {
        it("should throw NonExistentIdError", async () => {
          const inexistentUuid = "non-existent-uuid";
          const validDto: Partial<UpdateUserDto> = {
            firstName: "UpdatedName",
          };

          await expectError(
            () =>
              userController.updateUser(
                inexistentUuid,
                validDto as UpdateUserDto
              ),
            NonExistentIdError
          );
        });
      });
    });
  });

  describe("delete user by id", () => {
    describe("given user id is a number", () => {
      describe("when id exists in the database", () => {
        it("should delete the user", async () => {
          const existentId = 1;

          const deleteResult: DeleteResult = await userController.deleteUser(
            existentId
          );

          expect(deleteResult).toHaveProperty("affected", 1);
        });
      });

      describe("when id doesn't exist in the database", () => {
        it("should throw a NonExistentIdError", async () => {
          const nonExistentId = 999;

          await expectError(
            () => userController.deleteUser(nonExistentId),
            NonExistentIdError
          );
        });
      });
    });
  });

  describe("add role to user", () => {
    describe("given user uuid and role id are valid", () => {
      describe("when user uuid does not exist in the database", () => {
        it("should throw NonExistentIdError", async () => {
          const inexistentUuid = "non-existent-uuid";
          const roleId = 1;

          await expectError(
            () => userController.addRole(inexistentUuid, roleId),
            NonExistentIdError
          );
        });
      });

      describe("when user uuid exists in the database", () => {
        describe("and role id does not exist in the database", () => {
          it("should throw NonExistentIdError", async () => {
            const existentUuid = "some-uuid";
            const inexistentRoleId = 999;

            await expectError(
              () => userController.addRole(existentUuid, inexistentRoleId),
              NonExistentIdError
            );
          });
        });
        describe("and role id exists in the database", () => {
          it("should add the role to the user and return updated user", async () => {
            const existentUuid = "some-uuid";
            const roleId = 1;

            const updatedUser = await userController.addRole(
              existentUuid,
              roleId
            );

            expect(updatedUser).toHaveProperty("uuid", existentUuid);
            const roleAdded = updatedUser.roles.find(
              (role) => role.id === roleId
            );
            expect(roleAdded).toBeDefined;
          });
        });
      });
    });
  });

  describe("remove role from user", () => {
    describe("given user uuid and role id are valid", () => {
      describe("when user uuid does not exist in the database", () => {
        it("should throw NonExistentIdError", async () => {
          const inexistentUuid = "non-existent-uuid";
          const roleId = 1;

          await expectError(
            () => userController.removeRole(inexistentUuid, roleId),
            NonExistentIdError
          );
        });
      });

      describe("when user uuid exists in the database", () => {
        describe("and role id does not exist in the database", () => {
          it("should throw NonExistentIdError", async () => {
            const existentUuid = "some-uuid";
            const inexistentRoleId = 999;

            await expectError(
              () => userController.removeRole(existentUuid, inexistentRoleId),
              NonExistentIdError
            );
          });
        });
        describe("and role id exists in the database", () => {
          it("should remove the role from the user and return updated user", async () => {
            const existentUuid = "some-uuid";
            const roleId = 1;

            const updatedUser = await userController.removeRole(
              existentUuid,
              roleId
            );

            expect(updatedUser).toHaveProperty("uuid", existentUuid);
            const roleRemoved = updatedUser.roles.find(
              (role) => role.id === roleId
            );
            expect(roleRemoved).toBeUndefined;
          });
        });
      });
    });
  });

  describe("get user by email", () => {
    describe("given email is a string", () => {
      describe("when email exists in the database", () => {
        it("should return the user", async () => {
          const email = "david.miller@example.com";

          const foundUser = await userController.getUserByEmail(email);

          expect(foundUser).toHaveProperty("email", email);
        });
      });

      describe("when email does not exist in the database", () => {
        it("should return NotFoundError", async () => {
          const email = "non-existent@example.com";

          await expectError(
            () => userController.getUserByEmail(email),
            NotFoundError
          );
        });
      });
    });
  });

  describe("get user by uuid", () => {
    describe("given uuid is a string", () => {
      describe("when uuid exists in the database", () => {
        it("should return the user", async () => {
          const uuid = "some-uuid";

          const foundUser = await userController.getUserByUuid(uuid);

          expect(foundUser).toHaveProperty("uuid", uuid);
        });
      });

      describe("when uuid does not exist in the database", () => {
        it("should throw NotFoundError", async () => {
          const uuid = "non-existent-uuid";

          await expectError(
            () => userController.getUserByUuid(uuid),
            NotFoundError
          );
        });
      });
    });
  });

  describe("create order for user", () => {
    describe("given user uuid is a string and order dto is valid", () => {
      describe("when user uuid exists in the database", () => {
        it("should create and return the order", async () => {
          const userUuid = "some-uuid";
          const validDto: CreateUserOrderDto = {
            orderProducts: [
              {
                productId: 1,
                quantity: 2,
              },
            ],
          };

          const createdOrder = await userController.createOrder(
            userUuid,
            validDto
          );
        });
      });

      describe("when user uuid does not exist in the database", () => {
        it("should throw a NonExistentIdError", async () => {
          const nonExistentUuid = "non-existent-uuid";
          const validDto: CreateUserOrderDto = {
            orderProducts: [
              {
                productId: 1,
                quantity: 2,
              },
            ],
          };

          await expectError(
            () => userController.createOrder(nonExistentUuid, validDto),
            NotFoundError
          );
        });
      });
    });
  });

  describe("get user with orders", () => {
    describe("given uuid is a string", () => {
      describe("when uuid exists in the database", () => {
        it("should return the user with orders", async () => {
          const uuid = "some-uuid";

          const foundUser = await userController.getUserWithOrders(uuid);

          expect(foundUser).toHaveProperty("uuid", uuid);
          expect(foundUser).toHaveProperty("orders");
        });
      });

      describe("when uuid does not exist in the database", () => {
        it("should throw not found error", async () => {
          const uuid = "non-existent-uuid";

          await expectError(
            () => userController.getUserWithOrders(uuid),
            NotFoundError
          );
        });
      });
    });
  });

  describe("list orders", () => {
    describe("given uuid is a string", () => {
      describe("when uuid exists in the database", () => {
        it("should return a paginated list of orders", async () => {
          const uuid = "some-uuid";
          const offset = 0;
          const limit = 10;

          const orderList: PaginationResponse<Order> =
            await userController.listOrders(uuid, offset, limit);

          expect(orderList).toHaveProperty("data");
          expect(orderList).toHaveProperty("meta");
        });
      });

      describe("when uuid does not exist in the database", () => {
        it("should throw a NonExistentIdError", async () => {
          const uuid = "non-existent-uuid";
          const offset = 0;
          const limit = 10;

          await expectError(
            () => userController.listOrders(uuid, offset, limit),
            NotFoundError
          );
        });
      });
    });
  });

  describe("list sanitized orders", () => {
    describe("given uuid is a string", () => {
      describe("when uuid exists in the database", () => {
        it("should return a paginated list of sanitized orders", async () => {
          const uuid = "some-uuid";
          const offset = 0;
          const limit = 10;

          const orderList: PaginationResponse<SanitizedOrder> =
            await userController.listOrdersSanitized(uuid, offset, limit);

          expect(orderList).toHaveProperty("data");
          expect(orderList).toHaveProperty("meta");
        });
      });

      describe("when uuid does not exist in the database", () => {
        it("should throw a NonExistentIdError", async () => {
          const uuid = "non-existent-uuid";
          const offset = 0;
          const limit = 10;

          await expectError(
            () => userController.listOrdersSanitized(uuid, offset, limit),
            NotFoundError
          );
        });
      });
    });
  });

  describe("get order by user id and order id", () => {
    describe("given user id and order id are numbers", () => {
      describe("when user id and order id exist in the database", () => {
        it("should return the order", async () => {
          const userId = 3;
          const orderId = 3;

          const foundOrder = await userController.getOrder(userId, orderId);

          expect(foundOrder).toHaveProperty("id", orderId);
        });
      });

      describe("when user id or order id do not exist in the database", () => {
        it("should throw a NonExistentIdError", async () => {
          const userId = 1;
          const nonExistentOrderId = 999;

          await expectError(
            () => userController.getOrder(userId, nonExistentOrderId),
            NotFoundError
          );
        });
      });
    });
  });

  describe("delete user by email", () => {
    describe("given email is a string", () => {
      describe("when email exists in the database", () => {
        it("should delete the user", async () => {
          const email = "john.doe2@example.com";

          const result = await userController.deleteUserByEmail(email);

          expect(result).toHaveProperty("affected", 1);

          await expectError(
            () => userController.getUserByEmail(email),
            NotFoundError
          );
        });
      });

      describe("when email does not exist in the database", () => {
        it("should throw a NonExistentIdError", async () => {
          const email = "non-existent@example.com";

          await expectError(
            () => userController.deleteUserByEmail(email),
            NotFoundError
          );
        });
      });
    });
  });
});

