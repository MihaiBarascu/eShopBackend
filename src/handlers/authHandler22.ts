import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source"; // Asigură-te că importul este corect
import { User } from "../database/entity/User";
import { checkPassword } from "../utils/checkPassword";
import { generateJWT } from "../utils/generateJWT";

const create = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const { email, password } = request.body;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return response.status(404).send("Invalid email");
    }

    const isPasswordValid = await checkPassword(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).send("Invalid password");
    }

    const token = generateJWT(user.email);

    return response.status(200).send({ token });
  } catch (error) {
    console.error(error);
    return response.status(500).send("Internal server error");
  }
};

export default create;

//imagini, 1 produs mai multe img, tabel pivot  , one to many,  ruta adaugare imagini in controller produs produs/prudctid/image

//stochez iamgini, , nu mai amri de 5 mega

//PAGINARE PRODUSE
