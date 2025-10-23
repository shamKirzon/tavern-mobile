import { reservationController } from "./reservation.controller";
import { Router } from "express";

const reservationRoutes = Router();

reservationRoutes.post(
  "/create-reservation",
  reservationController.createReservation
);

reservationRoutes.post(
  "/get-reservation-data",
  reservationController.getReservationData
);

reservationRoutes.post("/upload-image", reservationController.uploadImage);

export default reservationRoutes;
