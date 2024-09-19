import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source"; // Asigură-te că importul este corect
import { User } from "../database/entity/User";
import { checkPassword } from "../utils/checkPassword";
import { generateJWT } from "../utils/generateJWT";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../utils/config";

const refreshToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    if (!REFRESH_TOKEN_SECRET) return response.sendStatus(404);

    const cookies = request.cookies;
    if (!cookies?.jwt) return response.sendStatus(401);

    const refreshToken = cookies.jwt;

    const userRepository = AppDataSource.getRepository(User);

    const foundUser = await userRepository.findOneBy({
      refreshToken: refreshToken,
    });
    if (!foundUser) return response.sendStatus(403);

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || foundUser.email != (decoded as JwtPayload).userInfo.email) {
        return response.sendStatus(403);
      }
      const accessToken = generateJWT(
        ACCESS_TOKEN_SECRET,
        "10m",
        decoded.userInfo
      );
      response.json({ accessToken });
    });
  } catch (error) {
    next(error);
  }
};
export default refreshToken;
