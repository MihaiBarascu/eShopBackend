import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "email must be a valid email address" })
  @IsNotEmpty({ message: "email is required" })
  email: string;

  @IsNotEmpty({ message: "password is required" })
  password: string;
}

