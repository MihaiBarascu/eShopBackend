import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import { ProductController } from "../controllers/ProductController";

import { CustomRequest } from "../interfaces";
import { ProductService } from "../services/ProductService";

import { validateFields } from "../shared/utils";
import { IncomingHttpHeaders } from "http";
import { NonExistentIdError } from "../errors/NonExistentIdError";

class ProductHandler {
  private productController: ProductController;
  private productService: ProductService;

  constructor() {
    this.productController = new ProductController();
    this.productService = new ProductService();
  }

  addCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      if (!productId) {
        return res
          .status(400)
          .json({ message: `Invalid or undefined productId param` });
      }

      const categoryId = Number(req.body.categoryToAdd);
      if (!categoryId) {
        return res.status(400).json({
          message: `Invalid or undefined categoryToAdd field in body`,
        });
      }

      const result = await this.productController.addCategory(
        productId,
        categoryId
      );

      return res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  };

  removeCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      if (!productId) {
        return res
          .status(400)
          .json({ message: `Invalid or undefined productId param` });
      }

      const categoryId = Number(req.params.categoryId);
      if (!categoryId) {
        return res.status(400).json({
          message: `Invalid or undefined categoryId param`,
        });
      }

      const result = await this.productController.removeCategory(
        productId,
        categoryId
      );

      return res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(CreateProductDto, req.body);

      const result = await this.productController.createProduct(dto);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      if (!productId) {
        return res
          .status(400)
          .json({ message: "productId param is invalid or undefined" });
      }

      const prodDto = plainToInstance(UpdateProductDto, req.body);
      const result = await this.productController.updateProduct(
        productId,
        prodDto
      );

      res.status(200).json({ result });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      if (!productId) {
        return res
          .status(400)
          .json({ message: "productId param is invalid or undefined" });
      }

      res
        .status(204)
        .json(await this.productController.deleteProduct(productId));
    } catch (error) {
      if (error instanceof NonExistentIdError) {
        return res.status(404).send({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  getProductList = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      return res.json(
        await this.productController.listProducts(
          req.pagination?.offset,
          req.pagination?.limit
        )
      );
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      if (!productId) {
        return res
          .status(400)
          .json({ message: "productId param is invalid or undefined" });
      }

      return res
        .status(200)
        .json(await this.productController.getProductById(productId));
    } catch (error) {
      next(error);
    }
  };

  addImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      const imageId =
        req.body.imageId !== undefined ? Number(req.body.imageId) : undefined;
      const headers = req.headers as IncomingHttpHeaders;

      if (isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const isMultipart = headers["content-type"]?.includes(
        "multipart/form-data"
      );

      if (imageId === undefined && isMultipart) {
        const newImage = await this.productController.addNewImage(
          productId,
          headers,
          req
        );
        return res.status(201).json(newImage);
      }

      if (imageId === undefined || isNaN(imageId)) {
        return res
          .status(400)
          .json({ error: "Invalid image ID or image header is missing" });
      }

      const updatedProduct =
        await this.productController.linkExistentImageToProduct(
          productId,
          imageId
        );
      return res.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  };

  removeImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = Number(req.params.productId);
      if (!productId) {
        return res
          .status(400)
          .json({ message: "productId param is invalid or undefined" });
      }
      const imageId = Number(req.params.imageId);
      if (!imageId) {
        return res
          .status(400)
          .json({ message: "imageId param is invalid or undefined" });
      }
      return res
        .status(204)
        .json(
          await this.productController.unlinkImageFromProduct(
            productId,
            imageId
          )
        );
    } catch (error) {
      next(error);
    }
  };
}

const productHandler = new ProductHandler();
export default productHandler;
