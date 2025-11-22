import express from "express";
import cors from "cors";
import http from "http";
import customerRoutes from "./src/customer/customer.routes";
import reservationRoutes from "./src/reservation/reservation.routes";
import orderRoutes from "./src/order/order.route";
import authRoutes from "./src/auth/auth.routes";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import employeeRoutes from "./src/employee/employee.route";

const rateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many request from this IP, please try again later" },
  standardHeaders: true,
  legacyHeaders: true,
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
// app.use(helmet());
// app.use(morgan("dev"));

app.use("/api/customer", customerRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/employee", employeeRoutes);

app.use("/api/auth", authRoutes);

export default app;
