import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateOrderDto {
  @IsNotEmpty({ message: "userId is required" })
  @IsNumber({}, { message: "userId must be a number" })
  userId: number;

  @IsOptional()
  @IsString({ message: "description must be a string" })
  @MaxLength(100, {
    message: "description must be at most 100 characters long",
  })
  description: string;

  @IsOptional()
  @IsString({ message: "type must be a string" })
  @MaxLength(100, { message: "type must be at most 100 characters long" })
  type: string;

  @IsOptional()
  @IsString({ message: "status must be a string" })
  @MaxLength(100, { message: "status must be at most 100 characters long" })
  status: string;

  // @IsOptional()
  // @IsArray({ message: "orderProducts must be an array" })
  // @ArrayNotEmpty({ message: "orderProducts must not be empty" })
  // @ArrayMinSize(1, { message: "orderProducts must contain at least one item" })
  // @ValidateNested({ each: true })
  // orderProducts?: OrderProductDto[];
}

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber({}, { message: "userId must be a number" })
  userId?: number;

  @IsOptional()
  @IsString({ message: "description must be a string" })
  @MaxLength(100, {
    message: "description must be at most 100 characters long",
  })
  description?: string;

  @IsOptional()
  @IsString({ message: "type must be a string" })
  @MaxLength(100, { message: "type must be at most 100 characters long" })
  type?: string;

  @IsOptional()
  @IsString({ message: "status must be a string" })
  @MaxLength(100, { message: "status must be at most 100 characters long" })
  status?: string;
}

