import { Router } from "express";
import { authController } from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/token/update", authController.updateToken);
authRoutes.post("/token/refresh", authController.refreshToken);
authRoutes.post("/otp/send-otp", authController.sendOtp);
authRoutes.post("/otp/validate-otp", authController.validateOtp);

export default authRoutes;
