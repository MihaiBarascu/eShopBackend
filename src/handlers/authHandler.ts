import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source"; // Asigură-te că importul este corect
import { User } from "../database/entity/User";
import { checkPassword } from "../utils/checkPassword";
import { generateJWT } from "../utils/generateJWT";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../utils/config";

const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
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

    let rolesNames = user?.roles.map((role) => role.name);
    let permissions = user?.roles.flatMap((role) => role.permissions);

    let permissionNames = permissions.map((permission) => permission.name);

    rolesNames = [...new Set(rolesNames)];
    permissionNames = [...new Set(permissionNames)];

    console.log(rolesNames, permissionNames);

    const accessToken = generateJWT(ACCESS_TOKEN_SECRET, "10m", {
      email: user.email,
      roles: rolesNames,
      permissions: permissionNames,
    });

    const refreshToken = generateJWT(REFRESH_TOKEN_SECRET, "10m", {
      email: user.email,
      roles: rolesNames,
      permissions: permissionNames,
    });

    user.refreshToken = refreshToken;

    const savedUser = await userRepository.save(user);

    response.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure:true
    });
    response.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return response.status(500).send("Internal server error");
  }
};

export default login;
