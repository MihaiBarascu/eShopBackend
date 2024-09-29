import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import Product from "../database/entity/Product";
import { AppDataSource } from "../database/data-source";
import Category from "../database/entity/Category";
import { PaginationResponse } from "../interfaces";
import { get, getById } from "../shared/repositoryMethods";
import ImageService from "./ImageService";
import { Request } from "express";
import path from "path";
import Image from "../database/entity/Image";

export class ProductService {
  imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  async listProducts(
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Product>> {
    return await get(Product, undefined, undefined, offset, limit);
  }

  async getProductById(productId: number): Promise<Product> {
    return await getById<Product>(Product, productId);
  }

  async createProduct(prodDto: CreateProductDto) {
    const newProduct = new Product();

    newProduct.name = prodDto.name;
    newProduct.description = prodDto.description;
    newProduct.price = prodDto.price;
    newProduct.stock = prodDto.stock;
    newProduct.isActive = prodDto.isActive;

    if (prodDto.categories && prodDto.categories.length) {
      const categoryRepository = AppDataSource.getRepository(Category);

      const categories = await categoryRepository.find({
        where: prodDto.categories.map((id: number) => ({ id })),
      });

      if (categories) {
        newProduct.categories = categories;
      }
    }

    return await AppDataSource.getRepository(Product).save(newProduct);
  }

  async updateProduct(productId: number, productDto: UpdateProductDto) {
    const productRep = AppDataSource.getRepository(Product);

    const foundProd = await productRep.findOneOrFail({
      where: { id: productId },
    });

    foundProd.name = productDto.name || foundProd.name;
    foundProd.description = productDto.description || foundProd.description;
    foundProd.price = productDto.price || foundProd.price;
    foundProd.stock = productDto.stock || foundProd.stock;
    foundProd.isActive = productDto.isActive ?? foundProd.isActive;

    if (productDto.categories && productDto.categories.length) {
      const categoryRepository = AppDataSource.getRepository(Category);

      const categories = await categoryRepository.find({
        where: productDto.categories.map((id: number) => ({ id })),
      });

      if (categories) {
        foundProd.categories = categories;
      }
    }

    return await productRep.save(foundProd);
  }

  async removeImage(productId: number, imageId: number): Promise<Product> {
    const product = await this.getProdWithImgRel(productId);

    product.images = product.images.filter(
      (image) => Number(image.id) !== imageId
    );

    return await AppDataSource.getRepository(Product).save(product);
  }

  async getProdWithImgRel(productId: number): Promise<Product> {
    const product: Product = (
      await get(Product, { id: productId }, { images: true })
    ).data[0];

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    return product;
  }

  async addImage(productId: number, imageId: number): Promise<Product> {
    const foundProduct = await this.getProdWithImgRel(productId);
    const foundImage = await getById(Image, imageId);
    if (!foundImage) {
      throw new Error("Image not found");
    }
    foundProduct.images.push(foundImage);

    return AppDataSource.getRepository(Product).save(foundProduct);
  }
}

