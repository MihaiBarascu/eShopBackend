import { ImageController } from "../../src/controllers/ImageController";
import { AppDataSource } from "../../src/database/data-source";
import { clearAllTables } from "../database-for-tests/setupTestDatabase";
import { IncomingHttpHeaders } from "http";
import { Readable } from "stream";
import path from "path";
import fs from "fs";
import FormData from "form-data";

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: require("../database-for-tests/setupTestDatabase")
    .AppDataSource,
}));

let imageController: ImageController;
jest.setTimeout(10000);
beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  imageController = new ImageController();
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await clearAllTables(AppDataSource);
    await AppDataSource.destroy();
  }
});

describe("ImageController", () => {
  describe("addImage", () => {
    it("should upload an image and save its details in the database", async () => {
      const filePath = path.join(__dirname, "../test-files/test-image2.jpg");

      const form = new FormData();
      form.append("file", fs.createReadStream(filePath));
      form.append("location", "test");
      form.append("description", "Test Image");

      const headers: IncomingHttpHeaders = form.getHeaders();

      try {
        const image = await imageController.addImage(headers, form, "test");

        console.log("Image added:", image);

        expect(image).toBeDefined();
        expect(image).toHaveProperty("id");
        expect(image).toHaveProperty("name");
        expect(image.name).toContain("test-image2.jpg");
      } catch (error) {
        throw error;
      }
    });
  });

  describe("remove image from memory by id", () => {
    describe("given image id id valid", () => {
      it("should delete the image", async () => {
        await imageController.deleteImageFromMemory(1, "test");
      });
    });
  });
});

