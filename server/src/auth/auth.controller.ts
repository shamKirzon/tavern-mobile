import { Response, Request } from "express";
import { authService } from "./auth.service";

class AuthController {
  async updateToken(req: Request, res: Response) {
    try {
      const { oldToken, update } = req.body;
      if (!oldToken)
        return res.status(400).json({ message: "it must have an old token" });

      console.log("oldtoken:", oldToken);
      console.log("update", update);

      const updatedToken = await authService.updateToken(oldToken, update);
      console.log("updatedToken Result: ", updatedToken);

      res.status(201).json({ token: updatedToken });
    } catch (error: any) {
      console.error("authController/updateToken:", error.message);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { decodedToken } = req.body;
      if (!decodedToken)
        return res.status(400).json({ message: "it must have a content " });

      const token = await authService.generateToken(decodedToken);
      res.status(200).json({ token });
    } catch (error: any) {
      console.error("authController/generateToken:", error.message);
    }
  }
}

export const authController = new AuthController();
