import { Response, Request } from "express";
import { otpService } from "./otp.service";

class OtpController {
  async sendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) return res.status(400).json({ message: "email is required" });

      const otp = await otpService.generateOtp(email);

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
      const validatedResult = await otpService.validateOtp(email, otp);

      if (validatedResult.isExpired == true && validatedResult.isValid == false)
        return res
          .status(400)
          .json({ message: "otp already expired. generate a new otp" });
      else if (
        validatedResult.isExpired == false &&
        validatedResult.isValid == false
      )
        return res.status(400).json({ message: "incorrect otp" });

      return res
        .status(200)
        .json({ message: "correct otp, welcome to my application" });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "can't perforrm otp validations",
      });
    }
  }
}

export const otpController = new OtpController();
