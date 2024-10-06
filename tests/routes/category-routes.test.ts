import supertest from "supertest";
import { CategoryController } from "../../src/controllers/CategoryController";
import { populateDatabase } from "../database-for-tests/setupTestDatabase";

jest.mock("../../src/controllers/CategoryController", () => {
  return {
    CategoryController: jest.fn(() => {}),
  };
});

