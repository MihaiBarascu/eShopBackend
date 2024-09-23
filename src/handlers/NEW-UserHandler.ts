import { Request, Response } from "express";
import { UserController } from "../controllers/user/UserController";

export class UserHandler {
  controller: UserController;

  constructor() {
    // this.controller = new UserController();
    // this.listUsers = this.listUsers.bind(this);
  }
}

