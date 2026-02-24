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

// reservation-employee
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

// reservation-cancellation
reservationRoutes.post(
  "/cancellation/create-cancellation",
  reservationController.createCancellation,
);

reservationRoutes.get(
  "/cancellation/get-cancellation-data/:reservationCancellationId",
  reservationController.getCancellationData,
);

export default reservationRoutes;
