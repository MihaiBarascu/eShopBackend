// import {
//   IsNotEmpty,
//   IsNumber,
//   IsOptional,
//   IsString,
//   MaxLength,
//   IsUUID,
//   Max,
// } from "class-validator";

// export class CreateImageDto {
//   @IsOptional()
//   @IsString({ message: "description must be a string" })
//   @MaxLength(255, {
//     message: "description must be at most 255 characters long",
//   })
//   description?: string;

//   @IsNotEmpty({ message: "type is required" })
//   @IsString({ message: "type must be a string" })
//   @MaxLength(100, { message: "type must be at most 100 characters long" })
//   type: string;

//   @IsNotEmpty({ message: "productId is required" })
//   @IsNumber({}, { message: "productId must be a number" })
//   productId: number;
// }

// export class UpdateImageDto {}

