import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (data: any) => {
  const payload = {
    tokenId: data.id,
    email: data.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 5 * 60 * 60 * 24,
  };

  const token = jwt.sign({ payload }, process.env.TOKEN_SECRET_KEY!, {
    expiresIn: "5d",
  });

  return token;
};
