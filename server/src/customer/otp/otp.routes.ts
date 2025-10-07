import { Router } from "express";
import { otpController } from "./otp.controller";

const otpRoutes = Router();

otpRoutes.post("/send-otp", otpController.sendOtp);
otpRoutes.post("/validate-otp", otpController.validateOtp);

export default otpRoutes;
