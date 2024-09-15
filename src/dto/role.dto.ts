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

export class CreateRoleDto {
  @IsNotEmpty({ message: "roleName is required" })
  @IsString({ message: "roleName must be a string" })
  @MaxLength(50, {
    message: "roleName must be at most 50 characters long",
  })
  name: string;

  @IsOptional()
  @IsString({ message: "description must be a string" })
  @MaxLength(100, {
    message: "description must be at most 100 characters long",
  })
  description: string;

  @IsOptional()
  @IsArray({ message: "permissions must be an array" })
  @ArrayNotEmpty({ message: "permissions must not be empty" })
  @ArrayMinSize(1, { message: "permissions must contain at least one item" })
  @IsNumber({}, { each: true, message: "each category must be a number" })
  permissions?: number[];
}

export class UpdateRoleDto {
  @IsOptional()
  @IsNumber({}, { message: "roleId must be a number" })
  roleId?: number;

  @IsOptional()
  @IsString({ message: "roleName must be a string" })
  @MaxLength(50, {
    message: "roleName must be at most 50 characters long",
  })
  roleName?: string;

  @IsOptional()
  @IsString({ message: "description must be a string" })
  @MaxLength(100, {
    message: "description must be at most 100 characters long",
  })
  description?: string;

  @IsOptional()
  @IsArray({ message: "permissions must be an array" })
  @ArrayNotEmpty({ message: "permissions must not be empty" })
  @ArrayMinSize(1, { message: "permissions must contain at least one item" })
  @IsNumber({}, { each: true, message: "each category must be a number" })
  permissions?: number[];
}

