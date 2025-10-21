import { ReservationData } from "../types/Reservation";
import { reservationRepository } from "./reservation.repository";

class ReservationService {
  async createReservation(data: ReservationData): Promise<any> {
    try {
      return await reservationRepository.createReservation(data);
    } catch (error) {
      console.error("Error in createReservation(): ", error);
    }
  }
}

export const reservationService = new ReservationService();
