import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { Length, IsEmail, IsNotEmpty, IsAlpha } from "class-validator";
import "reflect-metadata";
import Order from "./Order";
import { v4 as uuidv4 } from "uuid";
import { Role } from "./Role";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 36, nullable: true })
  uuid: string;

  @Column({ length: 100, nullable: false })
  firstName: string;

  @Column({ length: 100, nullable: false })
  lastName: string;

  @Column({ length: 100, nullable: false, unique: true })
  email: string;

  @Column({ type: "text", nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: "text", nullable: true })
  refreshToken: string;

  @ManyToMany(() => Role, (role: Role) => role.users)
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
  })
  roles: Role[];

  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Order[];

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }
}
