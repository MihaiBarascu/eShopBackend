import dotenv from "dotenv";
dotenv.config();

import supertest from "supertest";
import app from "../../src/app";
import ImageService from "../../src/services/ImageService";
import path from "path";

jest.setTimeout(7000);

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: require("../mocks/data-source").AppDataSource,
}));

jest.spyOn(ImageService.prototype, "uploadPicture").mockImplementation(() =>
  Promise.resolve({
    fileSize: 1000,
    type: "image/jpeg",
    name: "test-image.jpg",
  })
);

describe("Product Routes", () => {
  describe("POST /products (create product)", () => {
    it("should return a 201 and create the product", async () => {
      const newProduct = { name: "New Product", price: 100 };

      const response = await supertest(app)
        .post("/products")
        .set("Content-Type", "application/json")
        .send(newProduct);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(newProduct.name);
    });
  });
  it("should return a 400 error if the body is invalid", async () => {
    const invalidProduct = { name: "" };

    const response = await supertest(app)
      .post("/products")
      .send(invalidProduct);

    expect(response.statusCode).toBe(400);
  });
});

describe("GET /products", () => {
  it("should return a paginated list of products and 200 status", async () => {
    const response = await supertest(app).get("/products");

    expect(response.statusCode).toBe(200);
    expect(response.body.meta).toHaveProperty("limit");
    expect(response.body.meta).toHaveProperty("offset");
    expect(response.body.meta).toHaveProperty("total");
    expect(response.body.meta).toHaveProperty("pages");

    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe("GET /products/:productId", () => {
  describe("given the product id is not a number", () => {
    it("should return a 400", async () => {
      const productId = "sdadas";

      await supertest(app).get(`/products/${productId}`).expect(400);
    });
  });

  describe("given the product does not exist", () => {
    it("should return a 404", async () => {
      const productId = 99999;

      await supertest(app).get(`/products/${productId}`).expect(404);
    });
  });

  describe("given the product does exist", () => {
    it("should return a 200 status and the product", async () => {
      const productId = 1;

      const { body, statusCode } = await supertest(app).get(
        `/products/${productId}`
      );

      expect(statusCode).toBe(200);
      expect(body.id).toBe(productId);
    });
  });
});

describe("PUT /products/:productId", () => {
  it("should update a product and return 200 status", async () => {
    const productId = 1;
    const updatedProduct = { name: "Updated Product", price: 150 };

    const response = await supertest(app)
      .put(`/products/${productId}`)
      .send(updatedProduct);

    expect(response.statusCode).toBe(200);
    expect(response.body.result.name).toBe(updatedProduct.name);
  });
});

describe("DELETE /products/:productId", () => {
  it("should delete a product and return 204 status", async () => {
    const productId = 1;

    const response = await supertest(app).delete(`/products/${productId}`);

    expect(response.statusCode).toBe(204);
  });

  it("should return 404 if product does not exist", async () => {
    const productId = 99999; // ID inexistent

    const response = await supertest(app).delete(`/products/${productId}`);

    expect(response.statusCode).toBe(404);
  });
});

describe("POST /products/:productId/images", () => {
  describe("given an image file", () => {
    it("should add an image to a product and return 201", async () => {
      const productId = 1;
      const imagePath = path.join(__dirname, "../test-files/test-image.jpg");

      const response = await supertest(app)
        .post(`/products/${productId}/images`)
        .set("Content-Type", "multipart/form-data")
        .attach("image", imagePath);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
    });
  });

  describe("given an existing image ID", () => {
    it("should link the existing image to the product and return 200", async () => {
      const productId = 1;
      const imageId = 1;
      const imageData = { imageId };

      const response = await supertest(app)
        .post(`/products/${productId}/images`)
        .set("Content-Type", "application/json")
        .send(imageData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.id).toBe(imageId);
    });
  });
});

describe("DELETE /products/:productId/images/:imageId", () => {
  it("should remove an image from a product and return 204", async () => {
    const productId = 1;
    const imageId = 1;

    const response = await supertest(app).delete(
      `/products/${productId}/images/${imageId}`
    );

    expect(response.statusCode).toBe(204);
  });
});
