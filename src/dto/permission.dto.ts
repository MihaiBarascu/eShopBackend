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

export class CreatePermissionDto {
  @IsNotEmpty({ message: "permissionName is required" })
  @IsString({ message: "permissionName must be a string" })
  @MaxLength(50, {
    message: "permissionName must be at most 50 characters long",
  })
  name: string;

  @IsOptional()
  @IsString({ message: "description must be a string" })
  @MaxLength(100, {
    message: "description must be at most 100 characters long",
  })
  description: string;

  @IsOptional()
  @IsArray({ message: "roles must be an array" })
  @ArrayNotEmpty({ message: "roles must not be empty" })
  @ArrayMinSize(1, { message: "roles must contain at least one item" })
  @ValidateNested({ each: true })
  @Type(() => String)
  roles?: string[];
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString({ message: "permissionName must be a string" })
  @MaxLength(50, {
    message: "permissionName must be at most 50 characters long",
  })
  name?: string;

  @IsOptional()
  @IsString({ message: "description must be a string" })
  @MaxLength(100, {
    message: "description must be at most 100 characters long",
  })
  description?: string;

  @IsOptional()
  @IsArray({ message: "roles must be an array" })
  @ArrayNotEmpty({ message: "roles must not be empty" })
  @ArrayMinSize(1, { message: "roles must contain at least one item" })
  @ValidateNested({ each: true })
  @Type(() => String)
  roles?: string[];
}

