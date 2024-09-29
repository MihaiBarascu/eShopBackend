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

  addCategory = async (prodId: number, categId: number) => {
    return await this.categoryService.addCategory(prodId, categId);
  };
  removeCategory = async (prodId: number, categId: number) => {
    return await this.categoryService.removeCategory(prodId, categId);
  };

  addImage = async(prodId:number,imageId:number)=>{
    return await this.productService.addImage(prodId,imageId)
  }

  removeImage = async(prodId:number,imageId:number)=>{
    return await this.productService.removeImage(prodId,imageId)
  }

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
