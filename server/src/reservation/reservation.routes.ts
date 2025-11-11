import { reservationController } from "./reservation.controller";
import { Router } from "express";
import { uploadMiddleware } from "./reservation.controller";

const reservationRoutes = Router();

reservationRoutes.post(
  "/create-reservation",
  reservationController.createReservation
);

reservationRoutes.post(
  "/get-reservation-data/:reservationId",
  reservationController.getReservationData
);

reservationRoutes.get(
  "/get-reservation-status/:reservationId",
  reservationController.getReservationStatus
);

reservationRoutes.get(
  "/get-reservation-amount/:reservationId",
  reservationController.getReservationAmount
);

// for contentType: multipart/form-data
reservationRoutes.post(
  "/upload-image",
  uploadMiddleware,
  reservationController.uploadImage
);

export default reservationRoutes;
