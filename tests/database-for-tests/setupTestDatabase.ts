import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: 3309,
  username: "root",
  password: "root",
  database: "eShopTest",
  logging: false,
  entities: [path.join(__dirname, "../../src/database/entity/**/*.{js,ts}")],
  synchronize: true,
  subscribers: [],
});

export const populateDatabase = async (AppDataSource: DataSource) => {
  try {
    await AppDataSource.query(`
      INSERT INTO category (uuid, parentId, isActive, name, description, createdAt, updatedAt, deletedAt) VALUES
      ('d2c2a22d-8ff9-45f7-8c92-ef51c38eb0c1', NULL, 1, 'Electronics', 'Devices and gadgets for everyday use', NOW(), NOW(), NULL),
      ('b4c65f7e-d91c-4f4f-9e76-faa8c97f678e', NULL, 1, 'Fashion', 'Clothing, shoes, and accessories', NOW(), NOW(), NULL),
      ('c92a15f3-0f59-4780-a7f4-47e3b28ee48e', NULL, 1, 'Home & Kitchen', 'Furniture and kitchen appliances', NOW(), NOW(), NULL),
      ('efb77cb8-b5c4-442c-b1cb-8be60cb2e7a5', NULL, 1, 'Books', 'Fiction and non-fiction literature', NOW(), NOW(), NULL),
      ('fe17b7e5-b6c5-42be-818f-f33d6a0584ff', NULL, 1, 'Toys', 'Fun and educational toys for children', NOW(), NOW(), NULL),
      ('03f7a3c7-8d6c-4f85-8b64-bd4de2cde5c9', NULL, 1, 'Sports', 'Equipment and apparel for sports activities', NOW(), NOW(), NULL),
      ('f1726786-6a37-4a25-9a88-fef0f18b7be0', NULL, 1, 'Health & Beauty', 'Personal care products and cosmetics', NOW(), NOW(), NULL),
      ('928efc81-8c16-4c57-9d81-dc918802dbb4', NULL, 1, 'Automotive', 'Car accessories and parts', NOW(), NOW(), NULL),
      ('9f14fbb5-61f8-4c67-9d68-88a2871f5c03', NULL, 1, 'Grocery', 'Food and household essentials', NOW(), NOW(), NULL),
      ('aee4d5ed-d745-4e62-a6f0-dc98f43097da', NULL, 1, 'Pet Supplies', 'Products for pets and animals', NOW(), NOW(), NULL);
    `);
  } catch (error) {
    console.error("Error inserting categories:", error);
  }

  try {
    await AppDataSource.query(`
      INSERT INTO product (uuid, stock, name, price, description, createdAt, updatedAt, deletedAt, isActive) VALUES
      ('a6d6e300-39a6-4f76-bc76-b1631b0a72b8', 50, 'Smartphone', 699, 'Latest model smartphone with advanced features.', NOW(), NOW(), NULL, 1),
      ('a12f61f4-f65c-4b43-a823-3a8027337639', 30, 'Laptop', 1099, 'High-performance laptop for gaming and productivity.', NOW(), NOW(), NULL, 1),
      ('7d6e193e-d5c4-4e67-b0f7-017f0e123d90', 100, 'Bluetooth Headphones', 129, 'Wireless headphones with noise cancellation.', NOW(), NOW(), NULL, 1),
      ('eeb64b55-d999-4876-a444-14ae88cf08e0', 200, 'Coffee Maker', 89, 'Automatic coffee maker with programmable settings.', NOW(), NOW(), NULL, 1),
      ('5db072a3-ec72-4c80-9e6f-7c2ecfcf4181', 75, 'LED TV', 499, '55-inch LED TV with 4K resolution.', NOW(), NOW(), NULL, 1),
      ('ec17e034-f44f-4b69-97f8-f2e9a8e1db3f', 20, 'Gaming Console', 399, 'Next-gen gaming console with exclusive titles.', NOW(), NOW(), NULL, 1),
      ('38fabc04-4ed4-44b7-a3a8-4786c0c97ab5', 60, 'Washing Machine', 749, 'Front-load washing machine with smart features.', NOW(), NOW(), NULL, 1),
      ('d4e3b87b-f30e-46b4-a97f-ec4621eb9f9d', 10, 'Air Fryer', 99, 'Healthy cooking with less oil.', NOW(), NOW(), NULL, 1),
      ('3a1f8bb1-1aaf-4a3e-b2c0-9c66a59f334f', 150, 'Backpack', 49, 'Durable backpack for school or travel.', NOW(), NOW(), NULL, 1),
      ('cbca62b0-e19c-40b5-883b-7fa8e62a0e49', 90, 'Yoga Mat', 29, 'Non-slip yoga mat for fitness enthusiasts.', NOW(), NOW(), NULL, 1);
    `);
  } catch (error) {
    console.error("Error inserting products:", error);
  }

  try {
    await AppDataSource.query(`
      INSERT INTO product_categories (product_id, category_id) VALUES
      (1, 1),  -- Smartphone în Electronics
      (2, 1),  -- Laptop în Electronics
      (3, 1),  -- Bluetooth Headphones în Electronics
      (4, 3),  -- Coffee Maker în Home & Kitchen
      (5, 3),  -- LED TV în Home & Kitchen
      (6, 1),  -- Gaming Console în Electronics
      (7, 3),  -- Washing Machine în Home & Kitchen
      (8, 2),  -- Backpack în Fashion
      (9, 4),  -- Yoga Mat în Sports
      (10, 5); -- Air Fryer în Home & Kitchen
    `);
  } catch (error) {
    console.error("Error inserting product_category:", error);
  }

  try {
    await AppDataSource.query(`
      INSERT INTO roles (uuid, name, description, createdAt, updatedAt) VALUES
      ('a45b9a1c-6a4e-4e6c-9a8f-1f098bd4d3a5', 'Admin', 'Administrator with full access rights.', NOW(), NOW()),
      ('b2c19458-5ef4-42b3-83e4-5b62145ab15d', 'User', 'Regular user with limited access.', NOW(), NOW()),
      ('fdfcf44d-bac4-4cf7-8377-d5bb2a6f1c3a', 'Moderator', 'User with permissions to manage content.', NOW(), NOW());
    `);
  } catch (error) {
    console.error("Error inserting roles:", error);
  }

  try {
    await AppDataSource.query(`
      INSERT INTO images (uuid, name, description, createdAt, updatedAt, size) VALUES
      ('a45b9a1c-6a4e-4e6c-9a8f-1f098bd4d3a5', 'image1', 'TestImage', NOW(), NOW(), 112),
      ('a45b9wew-6a4e-4e6c-9a8f-1f098bd4d3a5', 'image2', 'TestImage', NOW(), NOW(), 112)
      
    `);
  } catch (error) {
    console.error("Error inserting images:", error);
  }
};

export async function clearAllTables(AppDataSource: DataSource) {
  if (!AppDataSource.isInitialized) {
    throw new Error("Data Source is not initialized");
  }

  const entities = AppDataSource.entityMetadatas;

  await AppDataSource.query(`SET FOREIGN_KEY_CHECKS = 0;`);

  for (const entity of entities) {
    const tableName = entity.tableName;
    const repository = AppDataSource.getRepository(entity.name);

    try {
      await repository.query(`DELETE FROM ${tableName}`);
      await repository.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`);
    } catch (error) {
      console.error(`Error clearing table ${tableName}:`, error);
    }
  }

  await AppDataSource.query(`SET FOREIGN_KEY_CHECKS = 1;`);

  console.log("All tables have been cleared");
}

