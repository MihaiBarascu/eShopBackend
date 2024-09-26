import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import shared from "./shared";
import { User } from "../database/entity/User";
import { AuthController } from "../controllers/AuthController";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { CreateUserOrderDto } from "../dto/userOrder.dto";
import { extendedRequest } from "../utils/types";
import { ACCESS_TOKEN_SECRET } from "../utils/config";
import { UserService } from "../services/UserService";
import { JwtPayload } from "jsonwebtoken";

class AuthHandler {
  private authController: AuthController;
  private userService: UserService;

  constructor() {
    this.authController = new AuthController();
    this.userService = new UserService();
  }

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "email field is empty" });
      }

      const token = await this.authController.getResetPasswordToken(email);

      return res.json(token);
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newPassword } = req.body;
      if (!newPassword) {
        return res
          .status(400)
          .json({ message: "newPassword field is missing from body" });
      }

      const token = req.query.token as string;

      const result = await this.authController.resetPassword(
        token,
        newPassword
      );

      return res.status(200).json(result)

    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const { accessToken, refreshToken } =
        await this.authController.loginAndGetTokens({ email, password });

      const cookieSettings =
        this.authController.authService.getRefreshTokenCookieOptions();

      res.cookie("jwt", refreshToken, cookieSettings);

      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.jwt || cookies.jwt === "") return res.sendStatus(204);
      const refreshToken = cookies.jwt;

      const cookieSettings =
        this.authController.authService.getRefreshTokenCookieOptions;
      await this.authController.logout(refreshToken);
      res.clearCookie("jwt", cookieSettings());
      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  };
}

const authHandler = new AuthHandler();
export default authHandler;

