import jwt from "jsonwebtoken";
import { User } from "../database/entity/User";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  SALT_ROUNDS,
  PASSWORD_RESET_TOKEN_SECRET,
} from "../utils/config";
import { AppDataSource } from "../database/data-source";
import { info, error as logErr } from "../utils/logger";
import { compare, hash } from "bcrypt";
import { randomBytes } from "crypto";

export class AuthService {
  private accessTokenSecret: string;
  private refreshTokenSecret: string;
  private passwordResetTokenSecret: string;
  private saltRounds: number;

  constructor() {
    this.accessTokenSecret = ACCESS_TOKEN_SECRET!;
    this.refreshTokenSecret = REFRESH_TOKEN_SECRET!;
    this.saltRounds = SALT_ROUNDS;
    this.passwordResetTokenSecret = PASSWORD_RESET_TOKEN_SECRET!;
  }

  checkPassword = async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return compare(password, hashedPassword);
  };

  finUserByRefreshToken = async (refreshToken: string): Promise<User> => {
    return await AppDataSource.getRepository(User).findOneByOrFail({
      refreshToken,
    });
  };

  hashPassword = async (myPlaintextPassword: string) => {
    return hash(myPlaintextPassword, this.saltRounds);
  };

  generateAccessToken = (user: User): string => {
    const roleIds: number[] = user?.roles?.map((role) => role.id);
    const uniqueRoleIds = [...new Set(roleIds)];

    return jwt.sign(
      {
        UserInfo: {
          email: user.email,
          roles: uniqueRoleIds,
          id: Number(user.id),
          uuid: user.uuid,
        },
      },
      this.accessTokenSecret,
      { expiresIn: "10m" }
    );
  };

  generateRefreshToken = (user: User): string => {
    return jwt.sign(
      {
        email: user.email,
      },
      this.refreshTokenSecret,
      { expiresIn: "5h" }
    );
  };

  getRefreshTokenCookieOptions = (): object => {
    return {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    };
  };

  generatePasswordResetToken = (user: User): string => {
    return jwt.sign(
      {
        id: user.id,
      },
      this.passwordResetTokenSecret,
      { expiresIn: "5m" }
    );
  };

  validateResetPasswordToken = (token: string) => {
    return jwt.verify(token, this.passwordResetTokenSecret);
  };

  validateAccessToken = (token: string) => {
    return jwt.verify(token, this.accessTokenSecret);
  };

  validateRefreshToken = (token: string) => {
    return jwt.verify(token, this.refreshTokenSecret);
  };

  // jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
  //   if (err) return response.sendStatus(403);
  //   request.email = (decoded as JwtPayload).UserInfo.email;
  //   request.roles = (decoded as JwtPayload).UserInfo.roles;
  //   request.permissions = (decoded as JwtPayload).UserInfo.permissions;
  //   request.id = (decoded as JwtPayload).UserInfo.id;
  //   request.uuid = (decoded as JwtPayload).UserInfo.uuid;
  //   console.log(request.email, request.roles, request.permissions, request.id);
  //   next();
  // });

  saveRefreshToken = async (
    user: User,
    refreshToken: string
  ): Promise<void> => {
    user.refreshToken = refreshToken;
    await AppDataSource.getRepository(User).save(user);
  };

  deleteRefreshToken = async (refreshToken: string) => {
    const foundUser = await AppDataSource.getRepository(User).findOneBy({
      refreshToken,
    });

    if (!foundUser) {
      throw new Error("Invalid token");
    }
    foundUser.refreshToken = randomBytes(32).toString("hex");
    await AppDataSource.getRepository(User).save(foundUser);
  };

  authenticate = async (
    user: User
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
      await this.saveRefreshToken(user, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      logErr("Error during authentication:", error);
      throw new Error("Authentication failed");
    }
  };
}

