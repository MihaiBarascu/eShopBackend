import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source"; // Asigură-te că importul este corect
import { User } from "../database/entity/User";

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../utils/config";

const logout = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const cookies = request.cookies;
    if (!cookies?.jwt) return response.sendStatus(204);

    const refreshToken = cookies.jwt;

    const userRepository = AppDataSource.getRepository(User);

    const foundUser = await userRepository.findOneBy({
      refreshToken: refreshToken,
    });
    if (!foundUser) {
      response.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return response.sendStatus(204);
    }

    foundUser.refreshToken = "";

    await userRepository.save(foundUser);

    response.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
export default logout;
