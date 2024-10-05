import { ProductController } from "../../src/controllers/ProductController";
import { expectNonExistentIdError, expectError } from "../testUtils";
import {
  clearAllTables,
  populateDatabase,
} from "../database-for-tests/setupTestDatabase";
import { CreateProductDto, UpdateProductDto } from "../../src/dto/product.dto";
import Product from "../../src/database/entity/Product";

import { AppDataSource } from "../../src/database/data-source";
import { PaginationResponse } from "../../src/interfaces";
import { InvalidNumberError } from "../../src/errors/InvalidNumberError";
import { NonExistentIdError } from "../../src/errors/NonExistentIdError";
import { DeleteResult, UpdateResult } from "typeorm";
import { DuplicateMemberError } from "../../src/errors/DuplicateMemberError";
import { MissingMemberError } from "../../src/errors/MissingMemberError";

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: require("../database-for-tests/setupTestDatabase")
    .AppDataSource,
}));

let productController: ProductController;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  productController = new ProductController();
  await populateDatabase(AppDataSource);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await clearAllTables(AppDataSource);
    await AppDataSource.destroy();
  }
});

describe("ProductController", () => {
  describe("given database has multiple product entries", () => {
    describe("list products", () => {
      describe("when limit param is 3 and offset param is 2", () => {
        it("should return a properly paginated response", async () => {
          const prodList: PaginationResponse<Product> =
            await productController.listProducts(2, 3);

          expect(prodList).toHaveProperty("data");
          expect(prodList).toHaveProperty("meta");

          const prodIdsToVerify = [3, 4, 5];
          const receivedProdIds = prodList.data.map((prod) => prod.id);

          expect(receivedProdIds).toEqual(prodIdsToVerify);

          expect(prodList.meta.limit).toBe(3);
          expect(prodList.meta.offset).toBe(2);
          expect(prodList.meta.page).toBe(1);
        });
      });
    });

    describe("get product by id", () => {
      describe("given id is a number", () => {
        describe("when id doesn't exist in the database", () => {
          it("should throw an NonExistentIdError", async () => {
            const inexistentId = 9999;

            await expectError(
              () => productController.getProductById(inexistentId),
              NonExistentIdError
            );
          });
        });
        describe("when id exists in the databse", () => {
          it("should return found user", async () => {
            const existentId = 1;

            const foundProduct = await productController.getProductById(
              existentId
            );

            expect(foundProduct).toHaveProperty("id", existentId);
          });
        });
      });
    });
  });

  describe("create product", () => {
    describe("when productDto is valid", () => {
      it("should create and return the product", async () => {
        const validDto: CreateProductDto = {
          name: "new product",
          price: 100,
          description: "new product description",
          categories: [1],
          stock: 77,
          isActive: true,
        };

        const createdProd = await productController.createProduct(validDto);

        expect(createdProd).toHaveProperty("name", validDto.name);
        expect(createdProd).toHaveProperty("price", validDto.price);
        expect(createdProd).toHaveProperty("description", validDto.description);
        expect(createdProd).toHaveProperty("categories");
      });
    });
  });

  describe("update product by id", () => {
    describe("given id is a number and product dto is valid", () => {
      describe("when id exists in the database", () => {
        it("should return updated product", async () => {
          const validDto: UpdateProductDto = {
            name: "updated product",
          } as any;
          const existentId = 1;

          const updatedProduct = await productController.updateProduct(
            existentId,
            validDto
          );

          expect(updatedProduct).toHaveProperty("id", existentId);
          expect(updatedProduct).toHaveProperty("name", validDto.name);
        });
      });

      describe("when id does not exist in the database", () => {
        it("should throw NonExistentIdError", async () => {
          const inexistentId = 99;
          const validDto: UpdateProductDto = {
            name: "updated product",
          } as any;

          await expectError(
            () => productController.updateProduct(inexistentId, validDto),
            NonExistentIdError
          );
        });
      });
    });
  });

  describe("delete product by id", () => {
    describe("given product id is a number", () => {
      describe("when id exists in the database", () => {
        it("should delete the product", async () => {
          const existentId = 1;

          const deleteResult: DeleteResult =
            await productController.deleteProduct(existentId);

          expect(deleteResult).toHaveProperty("affected", 1);
        });
      });

      describe("when id doesn't exist in the database", () => {
        it("should throw a NonExistentIdError", async () => {
          const nonExistentId = 999;

          await expectError(
            () => productController.deleteProduct(nonExistentId),
            NonExistentIdError
          );
        });
      });
    });
  });

  describe("restore deleted product by id", () => {
    describe("given product id is a  number", () => {
      describe("when id exists in the databse", () => {
        it("should restore deleted  product", async () => {
          const existentId = 1;

          const updatedResult: UpdateResult =
            await productController.restoreProduct(existentId);

          expect(updatedResult).toHaveProperty("affected", 1);
        });
      });
      describe("when id doesn't exist in the database", () => {
        it("should throw a NonExistentIdError", async () => {
          const nonExistentId = 999;

          await expectError(
            () => productController.restoreProduct(nonExistentId),
            NonExistentIdError
          );
        });
      });
    });
  });

  describe("add category to product", () => {
    describe("given product id and category id are valid", () => {
      describe("when product id does not exist in the database", () => {
        it("should throw NonExistentIdError", async () => {
          const inexistetProdId = 999;
          const categId = 1;

          await expectError(
            () => productController.addCategory(inexistetProdId, categId),
            NonExistentIdError
          );
        });
      });

      describe("when product id exists in the database", () => {
        describe("and category id does not exist in the database", () => {
          it("should throw NonExistentIdError", async () => {
            const existendPrd = 1;
            const inexistentCategId = 999;

            await expectError(
              () =>
                productController.addCategory(existendPrd, inexistentCategId),
              NonExistentIdError
            );
          });
        });
        describe("and category id exists in the database", () => {
          describe("when product is allready part of this category", () => {
            it("should throw a DuplicateMemberError", async () => {
              const prodId = 1;
              const allreadyAddedCategId = 1;

              await expectError(
                () =>
                  productController.addCategory(prodId, allreadyAddedCategId),
                DuplicateMemberError
              );
            });
          });
          describe("when product is not part of this category", () => {
            it("should add the category to the product and return updated product", async () => {
              const prodId = 1;
              const categId = 2;

              const result = await productController.addCategory(
                prodId,
                categId
              );
              expect(result).toHaveProperty("id", prodId);

              const foundCateg = result.categories.find(
                (cat) => cat.id === categId
              );

              expect(foundCateg).toBeDefined;
            });
          });
        });

        describe("Link existing image to product", () => {
          describe("When the image ID exists in the database", () => {
            it("should create a new relation in the product-images table and return the product with updated relations", async () => {
              const productId = 1;
              const existentImageId = 1;
              const updatedProduct =
                await productController.linkExistentImageToProduct(
                  productId,
                  existentImageId
                );

              const productImageEntry = await AppDataSource.query(
                `SELECT * from product_images where image_id=${existentImageId} and product_id=${productId}`
              );

              expect(productImageEntry[0]).toHaveProperty(
                "image_id",
                existentImageId
              );
              expect(productImageEntry[0]).toHaveProperty(
                "product_id",
                productId
              );
              const imageAdded = updatedProduct.images.find(
                (image) => image.id === existentImageId
              );
              expect(imageAdded).toBeDefined;
            });
          });
          describe("When the image ID doesn't exist in the database", () => {
            it("should throw a NonExistendIdError", async () => {
              const productId = 1;
              const NonExistentImageId = 3;
              await expectError(
                () =>
                  productController.linkExistentImageToProduct(
                    productId,
                    NonExistentImageId
                  ),
                NonExistentIdError
              );
            });
          });
        });

        describe("unlink image from a product", () => {
          describe("When the image ID doesn't exist in the database", () => {
            it("should throw a NonExistendIdError", async () => {
              const productId = 1;
              const NonExistentImageId = 3;
              await expectError(
                () =>
                  productController.unlinkImageFromProduct(
                    productId,
                    NonExistentImageId
                  ),
                NonExistentIdError
              );
            });
          });

          describe("when the image ID exists in the database", () => {
            describe("and the image is not linked to the product", () => {
              it("should throw a MissingMemberError", async () => {
                const productId = 1;
                const unlinkedImageId = 2;
                await expectError(
                  () =>
                    productController.unlinkImageFromProduct(
                      productId,
                      unlinkedImageId
                    ),
                  MissingMemberError
                );
              });
            });
            describe("and the image is linked to the product", () => {
              it("should delete the product-image relation and return the product with updated relation", async () => {
                const productId = 1;
                const linkedimageId = 1;

                const updatedProduct =
                  await productController.unlinkImageFromProduct(
                    productId,
                    linkedimageId
                  );

                const productImageEntry = await AppDataSource.query(
                  `SELECT * from product_images where image_id=${linkedimageId} and product_id=${productId}`
                );

                expect(productImageEntry).toHaveLength(0);
                expect(updatedProduct).toHaveProperty("id", productId);
              });
            });
          });
        });
      });
    });
  });
});

