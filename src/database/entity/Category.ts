import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { v4 } from "uuid";
import Product from "./Product";

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid")
  uuid: string;

  @Column({ nullable: true })
  parentId: number;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 255, nullable: true })
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

  @ManyToOne(() => Category, (category) => category.id)
  @JoinColumn({ name: "parentId" })
  parent: Category;
}

