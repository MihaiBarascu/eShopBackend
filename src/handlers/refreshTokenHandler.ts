import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../database/entity/User";

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../utils/config";

const refreshToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
      throw new Error("Token secrets are not defined");
    }

    const cookies = request.cookies;

    if (!cookies?.jwt) return response.sendStatus(401);

    const refreshToken = cookies.jwt;

    const userRepository = AppDataSource.getRepository(User);

    const foundUser = await userRepository.findOne({
      where: { refreshToken: refreshToken },
      relations: ["roles", "roles.permissions"],
    });

    if (!foundUser) return response.sendStatus(403);
    let roleIds: number[] = foundUser?.roles.map((role) => role.id);
    let permissions = foundUser?.roles.flatMap((role) => role.permissions);

    let permissionIds: number[] = permissions.map(
      (permission) => permission.id
    );

    const uniqueRoleIds = [...new Set(roleIds)];
    const uniquePermissionIds = [...new Set(permissionIds)];

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || foundUser.email != (decoded as JwtPayload).email) {
        return response.sendStatus(403);
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: decoded.email,
            roles: uniqueRoleIds,
            permissions: uniquePermissionIds,
            id: Number(foundUser.id),
          },
        },
        ACCESS_TOKEN_SECRET!,
        { expiresIn: "10m" }
      );

      response.json({ accessToken });
    });
  } catch (error) {
    next(error);
  }
};
export default refreshToken;

//tabela usertokens in care tin tokenii
