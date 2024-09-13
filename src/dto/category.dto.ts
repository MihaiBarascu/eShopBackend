import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateCategoryDto {
  @IsString({ message: "name must be a string" })
  @Length(3, 100, {
    message: "name must be between 3 and 100 characters long",
  })
  @IsNotEmpty({ message: "name is required" })
  name: string;

  @IsString({ message: "description must be a string" })
  @Length(3, 255, {
    message: "description must be between 3 and 255 characters long",
  })
  @IsNotEmpty({ message: "description is required" })
  description: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString({ message: "name must be a string" })
  @Length(3, 100, {
    message: "name must be between 3 and 100 characters long",
  })
  name: string;

  @IsOptional()
  @IsString({ message: "description must be a string" })
  @Length(3, 255, {
    message: "description must be between 3 and 255 characters long",
  })
  description: string;
}
