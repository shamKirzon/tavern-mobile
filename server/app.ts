import express from "express";
import cors from "cors";
import otpRoutes from "./src/customer/otp/otp.routes";
import customerRoutes from "./src/customer/customer.routes";
import reservationRoutes from "./src/reservation/reservation.routes";
import orderRoutes from "./src/order/order.route";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/otp", otpRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/order", orderRoutes);

export default app;
