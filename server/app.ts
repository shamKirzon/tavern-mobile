import express from "express";
import cors from "cors";
import otpRoutes from "./src/customer/otp/otp.routes";
import customerRoutes from "./src/customer/customer.routes";
import reservationRoutes from "./src/reservation/reservation.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/otp", otpRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/reservation", reservationRoutes);

export default app;
