import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from "typeorm";
import { v4 } from "uuid";
import Product from "./Product";

@Entity("images")
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

  @ManyToMany(() => Product, (product: Product) => product.images)
  @JoinTable({
    name: "product_images",
    joinColumn: { name: "image_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "product_id", referencedColumnName: "id" },
  })
  products: Product[];

  @BeforeInsert()
  addUuid() {
    this.uuid = v4();
  }
}

