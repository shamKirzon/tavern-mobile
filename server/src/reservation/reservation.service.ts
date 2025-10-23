import { ReservationData, ReservationImageType } from "../types/Reservation";
import { reservationRepository } from "./reservation.repository";

class ReservationService {
  async createReservation(data: ReservationData): Promise<any> {
    try {
      return await reservationRepository.createReservation(data);
    } catch (error) {
      console.error("Error in createReservation(): ", error);
    }
  }

  async getReservationData(email: string): Promise<any> {
    try {
      return await reservationRepository.getReservationData(email);
    } catch (error: any) {
      console.error("error in getting reservation information: ", error);
    }
  }
}

export const reservationService = new ReservationService();
