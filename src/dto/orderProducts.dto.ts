import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

export class CreateOrderProductsDto {
  @IsNotEmpty({ message: "orderId is required" })
  @IsNumber({}, { message: "orderId must be a number" })
  orderId: number;

  @IsNotEmpty({ message: "productId is required" })
  @IsNumber({}, { message: "productId must be a number" })
  productId: number;

  @IsNotEmpty({ message: "quantity is required" })
  @IsNumber({}, { message: "quantity must be a number" })
  quantity: number;

  @IsOptional()
  @IsString({ message: "status must be a string" })
  @MaxLength(255, { message: "status must be at most 255 characters long" })
  status?: string;

  @IsOptional()
  @IsString({ message: "description must be a string" })
  @MaxLength(255, {
    message: "description must be at most 255 characters long",
  })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: "isReady must be a boolean" })
  isReady?: boolean;
}

export class UpdateOrderProductsDto {
  @IsOptional()
  @IsNumber({}, { message: "quantity must be a number" })
  quantity?: number;

  @IsOptional()
  @IsString({ message: "status must be a string" })
  @MaxLength(255, { message: "status must be at most 255 characters long" })
  status?: string;

  @IsOptional()
  @IsString({ message: "description must be a string" })
  @MaxLength(255, {
    message: "description must be at most 255 characters long",
  })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: "isReady must be a boolean" })
  isReady?: boolean;
}

