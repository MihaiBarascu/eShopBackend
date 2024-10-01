import { Exclude, Expose, Transform } from "class-transformer";
import Order from "../database/entity/Order";
import { User } from "../database/entity/User";

export default class SanitizedOrder {
  id: number;
  description: string;
  type: string;
  status: string;
  @Exclude()
  createdAt: Date;
  @Exclude()
  uuid: string;
  @Exclude()
  userId: number;
  @Exclude()
  updatedAt: Date;

  @Exclude()
  user: User;

  @Exclude()
  deletedAt: Date;
  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}

