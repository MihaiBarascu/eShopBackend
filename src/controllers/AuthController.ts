import { LoginDto } from "../dto/login.dto";
import { get } from "../shared/repositoryMethods";
import { User } from "../database/entity/User";
import { checkPassword } from "../utils/checkPassword";
import { UserService } from "../services/UserService";
import { AuthService } from "../services/AuthService";
import { JwtPayload } from "jsonwebtoken";

export class AuthController {
  name: string;
  userServices: UserService;
  authService: AuthService;

  constructor() {
    this.name = "AuthController";
    this.userServices = new UserService();
    this.authService = new AuthService();
  }

  getResetPasswordToken = async (email: string) => {
    const foundUser = await this.userServices.getUserByEmail(email);
    if (!foundUser) {
      throw new Error("Invalid email");
    }

    return this.authService.generatePasswordResetToken(foundUser);
  };

  loginAndGetTokens = async (loginData: LoginDto) => {
    const { email, password } = loginData;
    const foundUser = await this.userServices.getUserByEmailWithRoles(email);

    if (!foundUser) {
      throw new Error("Invalid email");
    }
    const isPasswordValid = await this.authService.checkPassword(
      password,
      foundUser.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return this.authService.authenticate(foundUser);
  };

  resetPassword = async (token: string, newPass: string): Promise<User> => {
    const decoded = this.authService.validateResetPasswordToken(
      token
    ) as JwtPayload;

    const userId = decoded.id;
    if (!userId) {
      throw new Error("Invalid token");
    }
    console.log("------------------");
    return await this.userServices.resetPassword(userId, newPass);
  };

  logout = async (refreshToken: string) => {
    this.authService.deleteRefreshToken(refreshToken);
  };
}
