import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { UserOrderProdDto } from "./userOrderProducts.dto";

export class CreateUserOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UserOrderProdDto)
  orderProducts: UserOrderProdDto[];
}

