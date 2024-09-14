import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as generateUuid } from "uuid";
import Product from "./Product";
import Order from "./Order";

@Entity("order_products")
export default class OrderProducts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid")
  uuid: string;

  @PrimaryColumn({ nullable: false })
  orderId: number;

  @PrimaryColumn({ nullable: false })
  productId: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false, default: 0 })
  price: number;

  @Column({ nullable: true, default: null })
  isReady: boolean;

  @Column({ length: 255, nullable: true, default: null })
  status: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Order, (order) => order.orderProducts)
  @JoinColumn({ name: "orderId" })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderProducts)
  @JoinColumn({ name: "productId" })
  product: Product;

  @BeforeInsert()
  addUuid() {
    this.uuid = generateUuid();
  }
}

