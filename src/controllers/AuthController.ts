import { LoginDto } from "../dto/login.dto";
import { get } from "../shared/repositoryMethods";
import { User } from "../database/entity/User";
import { checkPassword } from "../utils/checkPassword";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import { JsonWebTokenError, JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError";
import { NotFoundError } from "../errors/NotFoundError";
import { InvalidTokenError } from "../errors/InvalidTokenError";

export class AuthController {
  name: string;
  userServices: UserService;
  authService: AuthService;

  constructor() {
    this.name = "AuthController";
    this.userServices = new UserService();
    this.authService = new AuthService();
  }

  getResetPasswordToken = async (email: string): Promise<string> => {
    const foundUser = await this.userServices.getUserByEmail(email);

    return this.authService.generatePasswordResetToken(foundUser!);
  };

  loginAndGetTokens = async (loginData: LoginDto) => {
    try {
      const { email, password } = loginData;
      const foundUser = await this.userServices.getUserByEmailWithRoles(email);

      const isPasswordValid = await this.authService.checkPassword(
        password,
        foundUser!.password
      );

      if (!isPasswordValid) {
        throw new InvalidCredentialsError(`Invalid email or password`);
      }

      return this.authService.authenticate(foundUser!);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new InvalidCredentialsError(`Invalid email or password`);
      }
      throw error;
    }
  };

  resetPassword = async (token: string, newPass: string): Promise<User> => {
    try {
      const decoded = this.authService.validateResetPasswordToken(
        token
      ) as JwtPayload;

      const uuid = decoded.uuid;
      if (!uuid) {
        throw new InvalidTokenError(
          "The provided reset password token is invalid "
        );
      }

      return await this.userServices.resetPassword(uuid, newPass);
    } catch (error) {
      if (
        (error instanceof JsonWebTokenError &&
          error.message.includes("jwt malformed")) ||
        error instanceof TokenExpiredError
      ) {
        throw new InvalidTokenError(
          "The provided reset password token is invalid or expired"
        );
      }
      throw error;
    }
  };

  logout = async (refreshToken: string): Promise<User> => {
    return await this.authService.deleteRefreshToken(refreshToken);
  };

  refresh = async (refreshToken: string): Promise<string> => {
    try {
      this.authService.validateRefreshToken(refreshToken);

      const foundUser = await this.authService.finUserByRefreshToken(
        refreshToken
      );

      return this.authService.generateAccessToken(foundUser);
    } catch (error) {
      if (
        (error instanceof JsonWebTokenError &&
          error.message.includes("jwt malformed")) ||
        error instanceof TokenExpiredError
      ) {
        throw new InvalidTokenError("Invalid or expired refresh token");
      }
      throw error;
    }
  };
}
//produse utlizator categorii

/// modific ruta de imagini
