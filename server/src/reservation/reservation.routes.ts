import { reservationController } from "./reservation.controller";
import { Router } from "express";
import { uploadMiddleware } from "./reservation.controller";

const reservationRoutes = Router();

reservationRoutes.post(
  "/create-reservation",
  reservationController.createReservation,
);

reservationRoutes.get(
  "/get-reservation-data/:reservationId",
  reservationController.getReservationData,
);

reservationRoutes.get(
  "/get-reservation-status/:reservationId",
  reservationController.getReservationStatus,
);

reservationRoutes.get(
  "/get-reservation-amount/:reservationId",
  reservationController.getReservationAmount,
);

reservationRoutes.post(
  "/assign-security-id",
  reservationController.assignSecurityId,
);

// for contentType: multipart/form-data
reservationRoutes.post(
  "/upload-image",
  uploadMiddleware,
  reservationController.uploadImage,
);

reservationRoutes.post(
  "/cancellation/create-cancellation",
  reservationController.createCancellation,
);

export default reservationRoutes;
