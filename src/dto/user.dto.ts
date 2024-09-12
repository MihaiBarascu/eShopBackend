import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString({ message: "firstName must be a string" })
  @Length(3, 20, {
    message: "firstName must be between 3 and 20 characters long",
  })
  @IsNotEmpty({ message: "firstName is required" })
  firstName: string;

  @IsString({ message: "lastName must be a string" })
  @Length(3, 20, {
    message: "lastName must be between 3 and 20 characters long",
  })
  @IsNotEmpty({ message: "lastName is required" })
  lastName: string;

  @IsEmail({}, { message: "email must be a valid email address" })
  @IsNotEmpty({ message: "email is required" })
  email: string;

  @IsString({ message: "password must be a string" })
  @MinLength(6, {
    message: "password must be between 6 and 10 characters long",
  })
  @IsNotEmpty({ message: "password is required" })
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "firstName must be a string" })
  @Length(3, 20, {
    message: "firstName must be between 3 and 20 characters long",
  })
  firstName: string;

  @IsOptional()
  @IsString({ message: "lastName must be a string" })
  @Length(3, 20, {
    message: "lastName must be between 3 and 20 characters long",
  })
  lastName: string;

  @IsOptional()
  @IsEmail({}, { message: "email must be a valid email address" })
  email: string;
}
