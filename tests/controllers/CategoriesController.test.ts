import { CategoryController } from "../../src/controllers/CategoryController";

import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../src/dto/category.dto";
import Category from "../../src/database/entity/Category";

import { AppDataSource } from "../mocks/data-source2";

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: require("../mocks/data-source2").AppDataSource,
}));

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("CategoryController", () => {
  let categoryController: CategoryController;

  beforeEach(() => {
    categoryController = new CategoryController();
  });

  it("should list categories", async () => {
    const newCategory = new Category();
    newCategory.name = "Test Category";
    await AppDataSource.getRepository(Category).save(newCategory);

    const result = await categoryController.listCategories();
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].name).toBe("Test Category");
  });

  it("should get category by id", async () => {
    const newCategory = new Category();
    newCategory.name = "Test Category";
    const savedCategory = await AppDataSource.getRepository(Category).save(
      newCategory
    );

    const result = await categoryController.getCatById(savedCategory.id);
    expect(result).toBeDefined();
    expect(result.name).toBe("Test Category");
  });

  it("should create a category", async () => {
    const dto: any = { name: "New Category" };

    const result = await categoryController.create(dto);
    expect(result).toBeDefined();
    expect(result.name).toBe("New Category");

    const savedCategory = await AppDataSource.getRepository(Category).findOneBy(
      { name: "New Category" }
    );
    expect(savedCategory).toBeDefined();
  });

  it("should generate HTML list", async () => {
    const newCategory = new Category();
    newCategory.name = "Test Category";
    await AppDataSource.getRepository(Category).save(newCategory);

    const result = await categoryController.generateHtmlList();
    expect(result).toContain("<li>Test Category</li>");
  });

  it("should update a category", async () => {
    const newCategory = new Category();
    newCategory.name = "Old Category";
    const savedCategory = await AppDataSource.getRepository(Category).save(
      newCategory
    );

    const dto: any = { name: "Updated Category" };
    const result = await categoryController.updateCategory(
      savedCategory.id,
      dto
    );
    expect(result).toBeDefined();
    expect(result.name).toBe("Updated Category");

    const updatedCategory = await AppDataSource.getRepository(
      Category
    ).findOneBy({ id: savedCategory.id });
    expect(updatedCategory).toBeDefined();
    expect(updatedCategory!.name).toBe("Updated Category");
  });

  it("should delete a category by id", async () => {
    const newCategory = new Category();
    newCategory.name = "Test Category";
    const savedCategory = await AppDataSource.getRepository(Category).save(
      newCategory
    );

    await categoryController.deleteCategoryById(savedCategory.id);

    const deletedCategory = await AppDataSource.getRepository(
      Category
    ).findOneBy({ id: savedCategory.id });
    expect(deletedCategory).toBeNull();
  });

  it("should restore a category by id", async () => {
    const newCategory = new Category();
    newCategory.name = "Test Category";
    const savedCategory = await AppDataSource.getRepository(Category).save(
      newCategory
    );

    await categoryController.deleteCategoryById(savedCategory.id);
    await categoryController.restoreCategoryById(savedCategory.id);

    const restoredCategory = await AppDataSource.getRepository(
      Category
    ).findOneBy({ id: savedCategory.id });
    expect(restoredCategory).toBeDefined();
    expect(restoredCategory!.name).toBe("Test Category");
  });
});

