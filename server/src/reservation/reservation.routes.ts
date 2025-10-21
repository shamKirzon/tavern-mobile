import { reservationController } from "./reservation.controller";
import { Router } from "express";

const reservationRoutes = Router();

reservationRoutes.post(
  "/create-reservation",
  reservationController.createReservation
);

export default reservationRoutes;
