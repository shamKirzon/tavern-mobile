import { Request, Response } from "express";
import { reservationService } from "./reservation.service";

class ReservationController {
  async createReservation(req: Request, res: Response) {
    try {
      const data = req.body;

      if (!data) return res.status(400).json({ message: "no data fetched" });

      const result = await reservationService.createReservation(data);
      console.info("reservation supabase result: ", result);

      return res
        .status(200)
        .json({ message: "Reservation Created Successfully! ", result });
    } catch (error: any) {
      console.error("error from createReservation(): ", error);
      return res.status(400).json({ message: "can't create reservation" });
    }
  }
}

export const reservationController = new ReservationController();
