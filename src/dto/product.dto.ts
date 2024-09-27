import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  ValidateNested,
  IsBoolean,
} from "class-validator";
import Category from "../database/entity/Category";
import { Type } from "class-transformer";

export class CreateProductDto {
  @IsString({ message: "name must be a string" })
  @MaxLength(50, {
    message: "name must be at most 50 characters long",
  })
  @IsNotEmpty({ message: "name is required" })
  name: string;

  @IsString({ message: "description must be a string" })
  @IsOptional()
  description: string;

  @IsNumber({}, { message: "price must be a number" })
  @Min(0, { message: "price must be a positive number" })
  @IsNotEmpty({ message: "price is required" })
  price: number;

  @IsNumber({}, { message: "stock must be a number" })
  @Min(0, { message: "stock must be a positive number" })
  @IsOptional()
  stock: number;

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsNumber({}, { each: true, message: "each category must be a number" })
  categories: number[];

  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive: boolean;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: "name must be a string" })
  @MaxLength(50, {
    message: "name must be at most 50 characters long",
  })
  name: string;

  @IsOptional()
  @IsString({ message: "description must be a string" })
  description: string;

  @IsOptional()
  @IsNumber({}, { message: "price must be a number" })
  @Min(0, { message: "price must be a positive number" })
  price: number;

  @IsOptional()
  @IsNumber({}, { message: "stock must be a number" })
  @Min(0, { message: "stock must be a positive number" })
  stock: number;

  @IsArray()
  @IsOptional()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsNumber({}, { each: true, message: "each category must be a number" })
  categories: number[];

  @IsOptional()
  @IsBoolean({ message: "isActive must be a boolean" })
  isActive: boolean;
}

