import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import { ProductController } from "../controllers/ProductController";

import { CustomRequest } from "../interfaces";
import { ProductService } from "../services/ProductService";

import { validateFields } from "../shared/utils";

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

      res.status(201).json({ result });
    } catch (error) {
      next(error);
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
      validateFields(req, {
        params: { productId: "productId" },
        body: { imageId: "imageId" },
      });

      const productId = Number(req.params.productId);

      const imageId = Number(req.body.imageId);

      return res.json(
        await this.productController.addImage(productId, imageId)
      );
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
      return res.json(
        await this.productController.removeImage(productId, imageId)
      );
    } catch (error) {
      next(error);
    }
  };

  // addImage = async (request, response, next) => {
  //   try {
  //     const productRepository = AppDataSource.getRepository(Product);
  //     const id = request.params.id;
  //     const product = await productRepository.findOne({
  //       where: { id: Number(request.params.id) },
  //       relations: ["images"],
  //     });
  //     if (!product) {
  //       return response
  //         .status(404)
  //         .json({ message: `Product with id ${id} not found` });
  //     }

  //     const productImageDetails = new ProductImage();

  //     const details = await uploadPicture(request, `products/${id}`);

  //     productImageDetails.name = details.name;
  //     productImageDetails.size = details.fileSize;
  //     productImageDetails.type = details.type;

  //     product.images.push(productImageDetails);

  //     const result = await productRepository.save(product);

  //     response.status(200).json(result);
  //   } catch (err) {
  //     next(err);
  //   }
  // };
}

const productHandler = new ProductHandler();
export default productHandler;
