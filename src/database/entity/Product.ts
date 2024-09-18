import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 } from "uuid";
import Category from "./Category";
import OrderProducts from "./OrderProducts";
import Image from "./ProductImage";

@Entity()
export default class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid")
  uuid: string;

  @Column()
  stock: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ nullable: false, default: 0 })
  price: number;

  @Column({ type: "text", nullable: false })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({
    name: "product_categories",
    joinColumn: { name: "product_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "category_id", referencedColumnName: "id" },
  })
  categories: Category[];

  @OneToMany(() => OrderProducts, (orderProduct) => orderProduct.product)
  orderProducts: OrderProducts[];

  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  images: Image[];

  @BeforeInsert()
  addUuid() {
    this.uuid = v4();
  }
}

