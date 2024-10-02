import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { v4 as generateUuid } from "uuid";
import { User } from "./User";
import { Permission } from "./Permission";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid")
  uuid: string;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 100, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateUuid() {
    this.uuid = generateUuid();
  }

  @ManyToMany(() => User, (user: User) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
  })
  permissions: Permission[];
}
