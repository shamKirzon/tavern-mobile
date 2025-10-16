import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = async (data: any) => {
  const { v4: uuidv4 } = await import("uuid");

  const payload = {
    email: data.email,
  };

  const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY!, {
    expiresIn: "5d",
    jwtid: uuidv4(),
  });

  return token;
};
