import { Request, Response } from "express";
import { reservationService } from "./reservation.service";
import { uploadImageWithUrl } from "../utils/uploadImage";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
export const uploadMiddleware = upload.single("file");

class ReservationController {
  async createReservation(req: Request, res: Response) {
    try {
      const { data } = req.body;

      console.log("from frontend data: ", data);
      if (!data) return res.status(400).json({ message: "no data fetched" });

      const result = await reservationService.createReservation(data);

      return res.status(201).json(result.reservation_id);
    } catch (error: any) {
      console.error("error from createReservation(): ", error);
      return res.status(400).json({ message: "can't create reservation" });
    }
  }
  async getReservationData(req: Request, res: Response) {
    try {
      const { reservationId } = req.params;

      console.log("reservation id: ", reservationId);

      if (!reservationId)
        return res.status(400).json({ message: "must have reservation id " });

      const result = await reservationService.getReservationData(reservationId);

      if (!result)
        return res
          .status(400)
          .json({ message: "there is no returned results. " });

      return res
        .status(200)
        .json({ message: "Reservation Created Successfully! ", result });
    } catch (error: any) {
      console.error("error from createReservation(): ", error);
      return res.status(400).json({ message: "can't create reservation" });
    }
  }
  async getReservationStatus(req: Request, res: Response) {
    try {
      const { reservationId } = req.params;

      if (!reservationId)
        return res.status(400).json({ message: "must have reservation id" });

      const status = await reservationService.getReservationStatus(
        reservationId
      );

      if (!status)
        return res
          .status(400)
          .json({ message: "there is no returned reservation status. " });

      return res.status(200).json({ status });
    } catch (error: any) {
      console.error("reservationController/createReservation(): ", error);
      return res.status(400).json({ message: "can't get reservation status" });
    }
  }

  async getReservationAmount(req: Request, res: Response) {
    try {
      const { reservationId } = req.params;

      if (!reservationId)
        return res.status(400).json({ message: "must have reservation id" });

      const amount = await reservationService.getReservationAmount(
        reservationId
      );

      if (!amount)
        return res
          .status(400)
          .json({ message: "there is no returned reservation status. " });

      return res.status(200).json({ amount });
    } catch (error: any) {
      console.error("reservationController/getReservationTotal(): ", error);
      return res.status(400).json({ message: "can't get reservation total" });
    }
  }

  async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file)
        return res.status(400).json({ message: "no file uploaded" });

      const localFile = req.file;
      const type = req.body.type;

      const imageUrl = await uploadImageWithUrl({ localFile, type });

      console.log("image url: ", imageUrl);
      return res
        .status(200)
        .json({ message: "image uploaded successfully", imageUrl });
    } catch (error: any) {
      console.error("error from uploadImage(): ", error);
      return res.status(400).json({ message: "can't upload image" });
    }
  }

  async assignEmployeeId(req: Request, res: Response) {
    try {
      const { employeeId, reservationId } = req.body;

      if (!reservationId)
        return res.status(400).json({ message: "must have reservation id" });

      const result = await reservationService.assignEmployeeId(
        employeeId,
        reservationId
      );

      if (!result)
        return res
          .status(400)
          .json({ message: "can't perform assigning employee id " });

      return res
        .status(200)
        .json({ message: "assigned employee id successfully!", result });
    } catch (error: any) {
      console.error("reservationController/getReservationTotal(): ", error);
      return res
        .status(400)
        .json({ message: "can't perform assigning employee id " });
    }
  }
}

export const reservationController = new ReservationController();
