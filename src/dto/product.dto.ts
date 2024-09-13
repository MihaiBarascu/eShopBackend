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

  @IsArray({ message: "categories must be an array" })
  @ArrayNotEmpty({ message: "categories must not be empty" })
  @ArrayMinSize(1, { message: "categories must contain at least one category" })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Number)
  category: number[];
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
}

