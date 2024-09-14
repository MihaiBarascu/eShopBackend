import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 } from "uuid";
import Product from "./Product";

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid")
  uuid: string;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 255, nullable: false })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  @BeforeInsert()
  addUuid() {
    this.uuid = v4();
  }
}

