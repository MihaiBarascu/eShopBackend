import supertest from "supertest";
import { CategoryController } from "../../src/controllers/CategoryController";
import app from "../../src/app";
import Category from "../../src/database/entity/Category";
import { AuthService } from "../../src/services/AuthService";
import { User } from "../../src/database/entity/User";
import { UpdateResult } from "typeorm";
import { NotFoundError } from "../../src/errors/NotFoundError";

const authService = new AuthService();

const generateAccessToken = (userPayload: Partial<User>) => {
  return authService.generateAccessToken(userPayload as User);
};

const userPayloadWithNoPermission = {
  uuid: "uuid1",
  email: "mihaialex.barascu@yahoo.com",
  roles: [{ id: 99 }],
};

const userPayloadWithPermission = {
  uuid: "uuid1",
  email: "mihaialex.barascu@yahoo.com",
  roles: [{ id: 1 }],
};

const categoryPayload = {
  name: "cat1",
  description: "desc",
  isActive: true,
  parentId: 3,
};

const updatedCategoryPayload = {
  name: "updatedCat",
  description: "updatedDesc",
  isActive: false,
  parentId: 2,
};

describe("Categories Route", () => {
  describe("GET /categories/:categoryId", () => {
    describe("when the category ID is not a number", () => {
      it("should return a 400 status code", async () => {
        const invalidCateg = "invalidCateg";
        await supertest(app).get(`/categories/${invalidCateg}`).expect(400);
      });
    });

    describe("when the category ID is a number", () => {
      describe("and the id exists in the database", () => {
        it("should return a 200 status and the category", async () => {
          const getCategoryByIdMock = jest
            .spyOn(CategoryController.prototype, "getCatById")
            .mockResolvedValue(categoryPayload as Category);

          const response = await supertest(app).get(`/categories/1`);
          expect(response.status).toBe(200);
          expect(response.body).toEqual(categoryPayload);

          expect(getCategoryByIdMock).toHaveBeenCalledWith(1);
          getCategoryByIdMock.mockRestore();
        });
      });
    });
  });

  describe("POST /categories", () => {
    describe("when the user is not logged in (doesn't own a valid access token)", () => {
      it("should return a 401 status", async () => {
        await supertest(app).post("/categories").expect(401);
      });
    });

    describe("when the user is logged in", () => {
      describe("and doesn't have the permission to create new categories", () => {
        it("should return a 403 status", async () => {
          const accessToken = generateAccessToken(
            userPayloadWithNoPermission as User
          );
          await supertest(app)
            .post("/categories")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(403);
        });
      });

      describe("and has the permission to create new categories", () => {
        const accessToken = generateAccessToken(
          userPayloadWithPermission as User
        );

        describe("when the body of the request is invalid", () => {
          it("should return a 400 status code", async () => {
            await supertest(app)
              .post("/categories")
              .set("Authorization", `Bearer ${accessToken}`)
              .expect(400);
          });
        });

        describe("when the body of the request is valid", () => {
          it("should create a category and return a 200 status code and category data", async () => {
            const createCategoryMock = jest
              .spyOn(CategoryController.prototype, "create")
              .mockResolvedValue(categoryPayload as Category);

            const response = await supertest(app)
              .post("/categories")
              .set("Authorization", `Bearer ${accessToken}`)
              .send(categoryPayload)
              .expect(200);

            const result = response.body.result;

            expect(createCategoryMock).toHaveBeenCalledWith(categoryPayload);

            expect(result.name).toBe(categoryPayload.name);
            expect(result.description).toBe(categoryPayload.description);
            expect(result.isActive).toBe(categoryPayload.isActive);
            expect(result.parentId).toBe(categoryPayload.parentId);

            createCategoryMock.mockRestore();
          });
        });
      });
    });
  });

  describe("PUT /categories/:id", () => {
    describe("when the user is not logged in (doesn't own a valid access token)", () => {
      it("should return a 401 status", async () => {
        await supertest(app).put("/categories/1").expect(401);
      });
    });

    describe("when the user is logged in", () => {
      describe("and doesn't have the permission to update categories", () => {
        it("should return a 403 status", async () => {
          const accessToken = generateAccessToken(
            userPayloadWithNoPermission as User
          );
          await supertest(app)
            .put("/categories/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(403);
        });
      });

      describe("and has the permission to update categories", () => {
        const accessToken = generateAccessToken(
          userPayloadWithPermission as User
        );

        describe("when the body of the request is invalid", () => {
          it("should return a 400 status code", async () => {
            await supertest(app)
              .put("/categories/1")
              .set("Authorization", `Bearer ${accessToken}`)
              .send({ invalidField: "invalidValue" })
              .expect(400);
          });
        });

        describe("when the body of the request is valid", () => {
          it("should update the category and return a 200 status code and updated category data", async () => {
            const updateCategoryMock = jest
              .spyOn(CategoryController.prototype, "updateCategory")
              .mockResolvedValue(updatedCategoryPayload as Category);

            const response = await supertest(app)
              .put("/categories/1")
              .set("Authorization", `Bearer ${accessToken}`)
              .send(updatedCategoryPayload)
              .expect(200);

            const result = response.body;

            expect(updateCategoryMock).toHaveBeenCalledWith(
              1,
              updatedCategoryPayload
            );

            expect(result.name).toBe(updatedCategoryPayload.name);
            expect(result.description).toBe(updatedCategoryPayload.description);
            expect(result.isActive).toBe(updatedCategoryPayload.isActive);
            expect(result.parentId).toBe(updatedCategoryPayload.parentId);

            updateCategoryMock.mockRestore();
          });
        });
      });
    });
  });

  describe("DELETE /categories/:id", () => {
    describe("when the user is not logged in (doesn't own a valid access token)", () => {
      it("should return a 401 status", async () => {
        await supertest(app).delete("/categories/1").expect(401);
      });
    });

    describe("when the user is logged in", () => {
      describe("and doesn't have the permission to delete categories", () => {
        it("should return a 403 status", async () => {
          const accessToken = generateAccessToken(
            userPayloadWithNoPermission as User
          );
          await supertest(app)
            .delete("/categories/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .expect(403);
        });
      });

      describe("and has the permission to delete categories", () => {
        const accessToken = generateAccessToken(
          userPayloadWithPermission as User
        );

        describe("when the category does not exist", () => {
          it("should return a 404 status code", async () => {
            const deleteCategoryMock = jest
              .spyOn(CategoryController.prototype, "deleteCategoryById")
              .mockRejectedValue(new NotFoundError("Category not found"));

            await supertest(app)
              .delete("/categories/1")
              .set("Authorization", `Bearer ${accessToken}`)
              .expect(404);

            deleteCategoryMock.mockRestore();
          });
        });

        describe("when the category exists", () => {
          it("should delete the category and return a 200 status code", async () => {
            const deleteCategoryMock = jest
              .spyOn(CategoryController.prototype, "deleteCategoryById")
              .mockResolvedValue({ affected: 1 } as UpdateResult);

            await supertest(app)
              .delete("/categories/1")
              .set("Authorization", `Bearer ${accessToken}`)
              .expect(200);

            expect(deleteCategoryMock).toHaveBeenCalledWith(1);
            deleteCategoryMock.mockRestore();
          });
        });
      });
    });
  });
});
