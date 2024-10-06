import {
  clearAllTables,
  populateDatabase,
} from "../database-for-tests/setupTestDatabase";

import { AppDataSource } from "../../src/database/data-source";

import { AuthController } from "../../src/controllers/AuthController";
import { LoginDto } from "../../src/dto/login.dto";
import { expectError } from "../testUtils";
import { InvalidCredentialsError } from "../../src/errors/InvalidCredentialsError";
import { UserController } from "../../src/controllers/UserController";
import { NotFoundError } from "../../src/errors/NotFoundError";
import { InvalidTokenError } from "../../src/errors/InvalidTokenError";
import { AuthService } from "../../src/services/AuthService";

jest.mock("../../src/database/data-source", () => ({
  AppDataSource: require("../database-for-tests/setupTestDatabase")
    .AppDataSource,
}));

let authController: AuthController;
let userController: UserController;
let authService: AuthService;
beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  authController = new AuthController();
  userController = new UserController();
  authService = new AuthService();
  await userController.createUser({
    lastName: "mihai",
    firstName: "barascu",
    email: "mihaialex_barascu@yahoo.com",
    password: "mihailol",
  });

  await populateDatabase(AppDataSource);
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await clearAllTables(AppDataSource);
    await AppDataSource.destroy();
  }
});

describe("AuthController", () => {
  describe("given the database is already populated with users", () => {
    describe("login with email and password", () => {
      describe("given email is in a valid form", () => {
        describe("when email doesn't exist in the database", () => {
          it("should throw an InvalidCredentialsError", async () => {
            const email = "eve2.wilson@example.com";
            const password = "invalidpassword";

            const loginData: LoginDto = {
              email,
              password,
            };
            await expectError(
              () => authController.loginAndGetTokens(loginData),
              InvalidCredentialsError
            );
          });
        });
        describe("when email exists in the database", () => {
          describe("and password is invalid", () => {
            it("should throw an InvalidCredentialsError", async () => {
              const email = "mihaialex_barascu@yahoo.com";
              const password = "invalidpassword";

              const loginData: LoginDto = {
                email,
                password,
              };
              await expectError(
                () => authController.loginAndGetTokens(loginData),
                InvalidCredentialsError
              );
            });
          });
          describe("and password is valid", () => {
            it("should return a valid access token and a valid refresh token", async () => {
              const email = "mihaialex_barascu@yahoo.com";
              const password = "mihailol";

              const loginData: LoginDto = {
                email,
                password,
              };

              const result = await authController.loginAndGetTokens(loginData);

              expect(result).toHaveProperty("accessToken");
              expect(result).toHaveProperty("refreshToken");
              expect(result.accessToken).toMatch(
                /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
              );
              expect(result.refreshToken).toMatch(
                /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
              );
            });
          });
        });
      });
    });

    describe("get reset password token by email", () => {
      describe("when email doesn't exist in the databse", () => {
        it("should throw a NotFoundError", async () => {
          await expectError(
            () =>
              authController.getResetPasswordToken("notfoundemail@gmail.com"),
            NotFoundError
          );
        });
      });
      describe("when the email exists in the databse", () => {
        it("should return a valid change password token", async () => {
          const resetpassToken = await authController.getResetPasswordToken(
            "mihaialex_barascu@yahoo.com"
          );
          console.log(
            "resetpasstoken",
            authService.validateResetPasswordToken(resetpassToken)
          );
          expect(resetpassToken).toMatch(
            /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
          );
        });
      });
    });

    describe("reset password with reset password token", () => {
      describe("when reset password token is invalid", () => {
        it("should throw an IvalidTokenError", async () => {
          await expectError(
            () => authController.resetPassword("invalidtoken", "NEWPASS"),
            InvalidTokenError
          );
        });
      });
      describe("when the reset password token is valid", () => {
        it("should change the password and allow the user to login with the new one", async () => {
          const resetpassToken = await authController.getResetPasswordToken(
            "mihaialex_barascu@yahoo.com"
          );

          await authController.resetPassword(resetpassToken, "parolanoua");
          const tokens = await authController.loginAndGetTokens({
            email: "mihaialex_barascu@yahoo.com",
            password: "parolanoua",
          });
          console.log(
            "accesstoken",
            authService.validateAccessToken(tokens.accessToken)
          );
          console.log(
            "refreshtoken",
            authService.validateRefreshToken(tokens.refreshToken)
          );

          expect(tokens).toHaveProperty("accessToken");

          expect(tokens).toHaveProperty("refreshToken");
        });
      });
    });

    describe("Access token refresh functionality ", () => {
      describe("when the refresh token is invalid", () => {
        it("should throw an InvalidTokenError", async () => {
          await expectError(
            () => authController.refresh("invalidRefreshToken"),
            InvalidTokenError
          );
        });
      });
      describe("when the refresh token is valid", () => {
        it("return a valid accesstoken", async () => {
          const { refreshToken } = await authController.loginAndGetTokens({
            email: "mihaialex_barascu@yahoo.com",
            password: "parolanoua",
          });

          const newAccessToken = await authController.refresh(refreshToken);
          expect(newAccessToken).toMatch(
            /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
          );
          authService.validateAccessToken(newAccessToken);
        });
      });
    });
    describe("Logout functionality", () => {
      describe("when the refresh token is invalid", () => {
        it("should throw an InvalidTokenError", async () => {
          await expectError(
            () => authController.logout("invalidRefreshToken"),
            InvalidTokenError
          );
        });
      });
      describe("when the refresh token is valid", () => {
        it("should invalidate the refresh token", async () => {
          const validRefreshToken = "refreshToken8";
          const updatedUser = await authController.logout(validRefreshToken);

          expect(updatedUser.refreshToken).not.toBe(validRefreshToken);
        });
      });
    });
  });
});

