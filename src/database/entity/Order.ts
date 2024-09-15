import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 } from "uuid";
import { User } from "./User";
import OrderProducts from "./OrderProducts";

@Entity("orders")
export default class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid")
  uuid: string;

  @Column({ nullable: false })
  userId: number;

  @Column({ length: 100, nullable: false })
  description: string;

  @Column({ length: 100, nullable: false })
  type: string;

  @Column({ length: 100, nullable: false })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => OrderProducts, (orderProducts) => orderProducts.order)
  orderProducts: OrderProducts[];

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @BeforeInsert()
  addUuid() {
    this.uuid = v4();
  }
}
