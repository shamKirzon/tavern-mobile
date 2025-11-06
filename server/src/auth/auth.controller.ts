import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { authService } from "./auth.service";

class AuthController {
  async updateToken(req: Request, res: Response) {
    try {
      const { oldToken, update } = req.body;
      if (!oldToken)
        return res.status(400).json({ message: "it must have an old token" });

      const updatedToken = await authService.updateToken(oldToken, update);
      console.log(updatedToken);

      res
        .status(201)
        .json({ message: "updated token successfully", updatedToken });
    } catch (error: any) {
      console.error("error in authController/updateToken:", error.message);
    }
  }

  async generateToken(req: Request, res: Response) {
    try {
      const { data } = req.body;
      if (!data)
        return res.status(400).json({ message: "it must have a content " });

      return await authService.generateToken(data);
    } catch (error: any) {
      console.error("error in authController/generateToken:", error.message);
    }
  }
}

export const authController = new AuthController();
