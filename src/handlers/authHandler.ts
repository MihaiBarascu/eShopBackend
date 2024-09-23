import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../database/entity/User";
import { checkPassword } from "../utils/checkPassword";

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../utils/config";
import jwt from "jsonwebtoken";
const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
      throw new Error("Token secrets are not defined");
    }

    const { email, password } = request.body;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email },
      relations: ["roles", "roles.permissions"],
    });

    if (!user) {
      return response.status(404).send("Invalid email");
    }

    const isPasswordValid = await checkPassword(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).send("Invalid password");
    }

    let roleIds: number[] = user?.roles.map((role) => role.id);
    let permissions = user?.roles.flatMap((role) => role.permissions);

    let permissionIds: number[] = permissions.map(
      (permission) => permission.id
    );

    const uniqueRoleIds = [...new Set(roleIds)];
    const uniquePermissionIds = [...new Set(permissionIds)];

    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: user.email,
          roles: uniqueRoleIds,
          permissions: uniquePermissionIds,
          id: Number(user.id),
          uuid: user.uuid,
        },
      },
      ACCESS_TOKEN_SECRET!,
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      {
        email: user.email,
      },
      REFRESH_TOKEN_SECRET!,
      { expiresIn: "5h" }
    );

    user.refreshToken = refreshToken;
    await userRepository.save(user);

    response.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    response.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export default login;
