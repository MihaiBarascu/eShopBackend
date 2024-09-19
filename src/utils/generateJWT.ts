import jwt from "jsonwebtoken";

export function generateJWT(
  secret: string | undefined,
  expiration: string | undefined,
  userInfo: object | undefined
) {
  if (!expiration || !secret || !userInfo) {
    throw new Error("Params are missing");
  }

  return jwt.sign({ userInfo }, secret, {
    expiresIn: expiration,
  });
}

//cum salvez tokenul in abza de date
//tabel
//refreshtoken valabilitate mai mare, cnad expira utilizatorul face request cu refreshytoken
