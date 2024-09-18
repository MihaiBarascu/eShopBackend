import jwt from "jsonwebtoken";

export function generateJWT(userInfo: object) {
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    throw new Error("JWT_SECRET or JWT_EXPIRES_IN envs not found");
  }

  return jwt.sign({ userInfo }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

//cum salvez tokenul in abza de date
//tabel
//refreshtoken valabilitate mai mare, cnad expira utilizatorul face request cu refreshytoken
