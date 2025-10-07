import express from "express";
import cors from "cors";
import otpRoutes from "./src/customer/otp/otp.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/otp", otpRoutes);

export default app;
