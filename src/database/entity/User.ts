import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Length, IsEmail, IsNotEmpty, IsAlpha } from "class-validator";
import "reflect-metadata";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsAlpha()
  @Length(3, 20, {
    message: "First name must be between 3 and 20 characters long.",
  })
  @IsNotEmpty({ message: "First name cannot be empty." })
  firstName: string;

  @Column()
  @IsAlpha()
  @Length(3, 20, {
    message: "Last name must be between 3 and 20 characters long.",
  })
  @IsNotEmpty({ message: "Last name cannot be empty." })
  lastName: string;

  @Column()
  @IsEmail({}, { message: "Email must be a valid email address." })
  @IsNotEmpty({ message: "Email cannot be empty." })
  email: string;

  @Column()
  @Length(6, 30, {
    message: "Password must be between 6 and 30 characters long.",
  })
  @IsNotEmpty({ message: "Password cannot be empty." })
  password: string;
}
