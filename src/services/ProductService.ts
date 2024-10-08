import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import Product from "../database/entity/Product";
import { AppDataSource } from "../database/data-source";
import Category from "../database/entity/Category";
import { PaginationResponse } from "../interfaces";
import {
  deleteById,
  get,
  getById,
  restoreById,
} from "../shared/repositoryMethods";
import ImageService from "./ImageService";
import { Request } from "express";
import path from "path";
import Image from "../database/entity/Image";
import { IncomingHttpHeaders } from "http";
import findOneOrFailTreated from "../shared/treatedFindOneOrFailMethod";
import { NonExistentIdError } from "../errors/NonExistentIdError";
import { MissingMemberError } from "../errors/MissingMemberError";

export class ProductService {
  imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  private async assignCategories(categoryIds: number[]): Promise<Category[]> {
    const categoryRepository = AppDataSource.getRepository(Category);
    return categoryRepository.find({
      where: categoryIds.map((id: number) => ({ id })),
    });
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
      const categories = await this.assignCategories(prodDto.categories);

      if (categories) {
        newProduct.categories = categories;
      }
    }

    return await AppDataSource.getRepository(Product).save(newProduct);
  }

  async deleteProduct(productId: number) {
    return await deleteById(Product, productId);
  }

  async restoreProduct(productId: number) {
    return await restoreById(Product, productId);
  }

  async updateProduct(productId: number, productDto: UpdateProductDto) {
    const productRep = AppDataSource.getRepository(Product);

    const foundProd = await findOneOrFailTreated(productRep, productId);

    foundProd.name = productDto.name ?? foundProd.name;
    foundProd.description = productDto.description ?? foundProd.description;
    foundProd.price = productDto.price ?? foundProd.price;
    foundProd.stock = productDto.stock ?? foundProd.stock;
    foundProd.isActive = productDto.isActive ?? foundProd.isActive;

    if (productDto.categories && productDto.categories.length) {
      const categories = await this.assignCategories(productDto.categories);
      if (categories) {
        foundProd.categories = categories;
      }
    }

    return await productRep.save(foundProd);
  }

  async unlinkImageFromProduct(
    productId: number,
    imageId: number
  ): Promise<Product> {
    const imageRep = AppDataSource.getRepository(Image);

    await findOneOrFailTreated(imageRep, imageId);

    const product = await this.getProdWithImgRel(productId);

    const imageIndex = product.images.findIndex(
      (image) => image.id === imageId
    );
    if (imageIndex === -1) {
      throw new MissingMemberError(
        `Product with id ${productId} is not linked with image with id ${imageId}`
      );
    }

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
      throw new NonExistentIdError(`Product with id ${productId} not found`);
    }

    return product;
  }

  async linkExistentImageToProduct(
    productId: number,
    imageId: number
  ): Promise<Product> {
    const foundProduct = await this.getProdWithImgRel(productId);
    const foundImage = await getById(Image, imageId);
    if (!foundImage) {
      throw new Error("Image not found");
    }
    foundProduct.images.push(foundImage);

    return AppDataSource.getRepository(Product).save(foundProduct);
  }

  async addNewImage(
    productId: number,
    headers: IncomingHttpHeaders,
    filestream: NodeJS.ReadableStream
  ): Promise<Product> {
    const foundProduct = await this.getProdWithImgRel(productId);

    const image = await this.imageService.addImage(headers, filestream);

    foundProduct.images.push(image);

    return await AppDataSource.getRepository(Product).save(foundProduct);
  }
}
