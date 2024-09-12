import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { User } from "./database/entity/User";
import { AppDataSource } from "./database/data-source";
import { validateBodyMiddleware } from "./middlewares/validationMiddleware";
import bcrypt from "bcrypt";
import { hashPassword } from "./utils/hashPassword";
import { CreateUserDto } from "./dto/user.dto";
import usersRouter from "./controllers/users";

dotenv.config();
hashPassword("mihai").then((vall) => {
  console.log(vall);
});

const app: Express = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/users", usersRouter);

// app.get("/users", async (req: Request, res: Response) => {
//   try {
//     const users = await AppDataSource.getRepository(User).find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Error getting users", error });
//   }
// });

// app.get("/users/:id", async (req: Request, res: Response) => {
//   try {
//     const user = await AppDataSource.getRepository(User).findOneBy({
//       id: Number(req.params.id),
//     });

//     if (user) {
//       res.json(user);
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error getting user", error });
//   }
// });

// app.post(
//   "/users",
//   validateBodyMiddleware(CreateUserDto),
//   async (request, response) => {
//     try {
//       const userRepository = AppDataSource.getRepository(User);
//       const user = request.body;

//       user.password = await hashPassword(user.password);

//       await userRepository.save(user);
//       response.status(201).json(user);
//     } catch (error) {
//       response.status(500).json({ error });
//     }
//   }
// );

// app.delete("/users/:id", async (req: Request, res: Response) => {
//   try {
//     const userRepositor = await AppDataSource.getRepository(User);

//     const userToRemove = await userRepositor.findOneBy({
//       id: Number(req.params.id),
//     });
//     if (userToRemove) {
//       await userRepositor.remove(userToRemove);
//     }
//     res.status(202).end();
//   } catch (error) {
//     res.status(500).json({ message: "Error getting user", error });
//   }
// });

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
