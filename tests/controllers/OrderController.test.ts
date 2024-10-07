import { OrderController } from "../../src/controllers/OrderController";
import { expectNonExistentIdError, expectError } from "../testUtils";
import {
  clearAllTables,
  populateDatabase,
} from "../database-for-tests/setupTestDatabase";
import { CreateOrderDto, UpdateOrderDto } from "../../src/dto/order.dto";
import Order from "../../src/database/entity/Order";
import { AppDataSource } from "../../src/database/data-source";
import { PaginationResponse } from "../../src/interfaces";
import { NonExistentIdError } from "../../src/errors/NonExistentIdError";
import { DeleteResult } from "typeorm";
import { CreateOrderProductsDto } from "../../src/dto/orderProducts.dto";

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: require("../database-for-tests/setupTestDatabase")
    .AppDataSource,
}));

let orderController: OrderController;
jest.setTimeout(10000);
beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  orderController = new OrderController();
  await populateDatabase(AppDataSource);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await clearAllTables(AppDataSource);
    await AppDataSource.destroy();
  }
});

describe("OrderController", () => {
  describe("given database has multiple order entries", () => {
    describe("list orders", () => {
      describe("when limit param is 3 and offset param is 2", () => {
        it("should return a properly paginated response", async () => {
          const orderList: PaginationResponse<Order> =
            await orderController.listOrders(2, 3);

          expect(orderList).toHaveProperty("data");
          expect(orderList).toHaveProperty("meta");

          const orderIdsToVerify = [3, 4, 5];
          const receivedOrderIds = orderList.data.map((order) => order.id);

          expect(receivedOrderIds).toEqual(orderIdsToVerify);

          expect(orderList.meta.limit).toBe(3);
          expect(orderList.meta.offset).toBe(2);
          expect(orderList.meta.page).toBe(1);
        });
      });
    });

    describe("get order by id", () => {
      describe("when id exists in the database", () => {
        it("should return the order", async () => {
          const validId = 1;

          const foundOrder: Order = await orderController.getOrder(validId);
          expect(foundOrder).toHaveProperty("id", validId);
        });
      });

      describe("when id does not exist in the database", () => {
        it("should throw a NonExistentIdError", async () => {
          const nonExistentId = 999;

          await expectError(
            () => orderController.getOrder(nonExistentId),
            NonExistentIdError
          );
        });
      });
    });

    describe("create order", () => {
      describe("when orderDto is valid", () => {
        it("should create and return the order", async () => {
          const validDto: Partial<CreateOrderDto> = {
            userId: 1,

            status: "Pending",
          };

          const createdOrder = await orderController.createOrder(
            validDto as CreateOrderDto
          );

          expect(createdOrder).toHaveProperty("userId", validDto.userId);
          expect(createdOrder).toHaveProperty("status", validDto.status);
        });
      });
    });

    describe("update order by id", () => {
      describe("given id is a number and order dto is valid", () => {
        describe("when id exists in the database", () => {
          it("should return updated order", async () => {
            const validDto: UpdateOrderDto = { status: "Shipped" };
            const existentId = 1;

            const updatedOrder = await orderController.updateOrder(
              existentId,
              validDto
            );

            expect(updatedOrder).toHaveProperty("id", existentId);
            expect(updatedOrder).toHaveProperty("status", validDto.status);
          });
        });
        describe("when id does not exist in the database", () => {
          it("should throw NonExistentIdError", async () => {
            const inexistentId = 99;
            const validDto: UpdateOrderDto = { status: "Cancelled" };

            await expectError(
              () => orderController.updateOrder(inexistentId, validDto),
              NonExistentIdError
            );
          });
        });
      });
    });

    describe("delete order by id", () => {
      describe("given order id is a number", () => {
        describe("when id exists in the database", () => {
          it("should delete the order", async () => {
            const existentId = 1;

            await orderController.deleteOrder(existentId);

            await expectError(
              () => orderController.getOrder(existentId),
              NonExistentIdError
            );
          });
        });
        describe("when id doesn't exist in the database", () => {
          it("should throw a NonExistentIdError", async () => {
            const nonExistentId = 999;

            await expectError(
              () => orderController.deleteOrder(nonExistentId),
              NonExistentIdError
            );
          });
        });
      });
    });

    describe("add products to order", () => {
      describe("given order id and product dto are valid", () => {
        describe("when order id exists in the database", () => {
          it("should add the products to the order and return updated order", async () => {
            const existentOrderId = 2;
            const productDto: Partial<CreateOrderProductsDto>[] = [
              { productId: 1, quantity: 2 },
              { productId: 2, quantity: 1 },
            ];

            const updatedOrder = await orderController.addProducts(
              existentOrderId,
              productDto as CreateOrderProductsDto[]
            );

            expect(updatedOrder).toHaveProperty("id", existentOrderId);
            expect(updatedOrder.orderProducts).toHaveLength(2);
          });
        });
        describe("when order id does not exist in the database", () => {
          it("should throw a NonExistentIdError", async () => {
            const inexistentOrderId = 999;
            const productDto: Partial<CreateOrderProductsDto>[] = [
              { productId: 1, quantity: 2 },
              { productId: 2, quantity: 1 },
            ];

            await expectError(
              () =>
                orderController.addProducts(
                  inexistentOrderId,
                  productDto as CreateOrderProductsDto[]
                ),
              NonExistentIdError
            );
          });
        });
      });
    });

    describe("remove product from order", () => {
      describe("given order id and product id are valid", () => {
        describe("when order id exists in the database", () => {
          it("should remove the product from the order and return updated order", async () => {
            const existentOrderId = 2;
            const productId = 1;

            const updatedOrder = await orderController.removeProduct(
              existentOrderId,
              productId
            );

            expect(updatedOrder).toHaveProperty("id", existentOrderId);
            const productRemoved = updatedOrder.orderProducts.find(
              (product) => product.id === productId
            );
            expect(productRemoved).toBeUndefined();
          });
        });
        describe("when order id does not exist in the database", () => {
          it("should throw a NonExistentIdError", async () => {
            const inexistentOrderId = 999;
            const productId = 1;

            await expectError(
              () => orderController.removeProduct(inexistentOrderId, productId),
              NonExistentIdError
            );
          });
        });
      });
    });
  });
});

