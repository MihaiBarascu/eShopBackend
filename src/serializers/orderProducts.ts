import { Exclude, Expose, Transform } from "class-transformer";
import Order from "../database/entity/Order";

export default class SanitizedOrderProducts {
  id: number;
  productId: number;
  description: string;
  type: string;
  isReady: boolean;
  price: number;
  quantity: number;

  @Exclude()
  uuid: string;

  @Exclude()
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  deletedAt: Date;

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}

