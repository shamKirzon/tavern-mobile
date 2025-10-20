import { Request, Response } from "express";
import { reservationService } from "./reservation.service";

class ReservationController {
  async createReservation(req: Request, res: Response) {
    try {
      const { data } = req.body;

      const email = data.email;

      if (!data) return res.status(400).json({ message: "no data fetched" });

      const result = await reservationService.createReservation(email);
    } catch (error: any) {
      console.error("error from createReservation(): ", error);
      return res.status(400).json({ message: "can't create reservation" });
    }
  }
}

export const reservationController = new ReservationController();
