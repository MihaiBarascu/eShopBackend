import { IsInt, Min, IsNotEmpty } from "class-validator";

export class UserOrderProdDto {
  @IsNotEmpty()
  @IsInt({ message: "Product ID must be a number" })
  @Min(1, { message: "Product ID must be greater than 0" })
  productId: number;

  @IsNotEmpty()
  @IsInt({ message: "Product quantity must be a number" })
  @Min(1, { message: "Product quantity must be greater than 0" })
  quantity: number;
}

