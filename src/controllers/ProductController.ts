import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import { ProductService } from "../services/ProductService";
import { CategoryService } from "../services/CategoryService";
import { PaginationResponse } from "../interfaces";
import Product from "../database/entity/Product";

export class ProductController {
  private productService: ProductService;
  private categoryService: CategoryService;

  constructor() {
    this.productService = new ProductService();
    this.categoryService = new CategoryService();
  }

  deleteProduct = async (prodId: number) => {
    return await this.productService.deleteProduct(prodId);
  };
  restoreProduct = async (prodId: number) => {
    return await this.productService.restoreProduct(prodId);
  };

  addCategory = async (prodId: number, categId: number) => {
    return await this.categoryService.addCategory(prodId, categId);
  };
  removeCategory = async (prodId: number, categId: number) => {
    return await this.categoryService.removeCategory(prodId, categId);
  };

  linkExistentImageToProduct = async (prodId: number, imageId: number) => {
    return await this.productService.linkExistentImageToProduct(
      prodId,
      imageId
    );
  };

  addNewImage = async (productId: number, headers, filestream) => {
    return await this.productService.addNewImage(
      productId,
      headers,
      filestream
    );
  };

  unlinkImageFromProduct = async (prodId: number, imageId: number) => {
    return await this.productService.unlinkImageFromProduct(prodId, imageId);
  };

  listProducts = async (
    offset: number | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<PaginationResponse<Product>> => {
    return await this.productService.listProducts(offset, limit);
  };

  getProductById = async (productId: number): Promise<Product> => {
    return await this.productService.getProductById(productId);
  };

  createProduct = async (prodDto: CreateProductDto) => {
    return await this.productService.createProduct(prodDto);
  };

  updateProduct = async (productId: number, productDto: UpdateProductDto) => {
    return await this.productService.updateProduct(productId, productDto);
  };
}
