import { Response, Request } from "express";
import { authService } from "./auth.service";
import { sendMail } from "../utils/sendMail";

class AuthController {
  async updateToken(req: Request, res: Response) {
    try {
      const { oldToken, update } = req.body;
      if (!oldToken)
        return res.status(400).json({ message: "it must have an old token" });

      const updatedToken = await authService.updateToken(oldToken, update);

      res.status(201).json({ token: updatedToken });
    } catch (error: any) {
      console.error(" Error in authController/updateToken():", error.message);
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

  async sendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) return res.status(400).json({ message: "email is required" });

      const otp = await authService.generateOtp(email);

      console.log("OTP: ", otp);

      await sendMail(email, otp);
      return res.status(200).json({ message: "otp sent", otp });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "can't send otp" });
    }
  }

  async validateOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      const validatedResult = await authService.validateOtp(email, otp);
      console.log(validatedResult);

      if (validatedResult.isExpired == true && validatedResult.isValid == false)
        return res.status(200).json({
          message: "otp already Expired. Generate a new otp",
          isValidOtp: false,
        });
      else if (
        validatedResult.isExpired == false &&
        validatedResult.isValid == false
      )
        return res
          .status(200)
          .json({ message: "incorrect otp", isValidOtp: false });

      return res
        .status(200)
        .json({ message: "otp successfully", isValidOtp: true });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "can't perforrm otp validations",
      });
    }
  }
}

export const authController = new AuthController();
