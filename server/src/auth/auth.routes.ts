import { Router } from "express";
import { authController } from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/update", authController.updateToken);
authRoutes.post("/generate", authController.generateToken);

export default authRoutes;
