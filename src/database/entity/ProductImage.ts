import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { v4 } from "uuid";
import Product from "./Product";

@Entity("product_images")
export default class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid")
  uuid: string;

  @Column({ nullable: false, type: "text" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  type: string;

  @Column({ type: "int", nullable: false })
  size: number;

  @Column({ length: 100, nullable: true })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: "int", nullable: false })
  productId: number;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: "productId" })
  product: Product;

  @BeforeInsert()
  addUuid() {
    this.uuid = v4();
  }
}
