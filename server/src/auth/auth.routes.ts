import { Router } from "express";
import { authController } from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/update", authController.updateToken);
authRoutes.post("/refresh", authController.refreshToken);
// meron akong generate pero di ko nilagyan ng controller since
// wala naman akong api endpoint na generate eh
// yung isa ko is si customer ang tinawag ko

export default authRoutes;
