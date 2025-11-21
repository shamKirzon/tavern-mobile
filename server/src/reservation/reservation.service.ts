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

  async getReservationData(reservationId: string): Promise<any> {
    try {
      return await reservationRepository.getReservationData(reservationId);
    } catch (error: any) {
      console.error("error in getting reservation information: ", error);
    }
  }

  async getReservationStatus(reservationId: string): Promise<any> {
    try {
      const status = await reservationRepository.getReservationStatus(
        reservationId
      );
      return status?.reservation_status;
    } catch (error) {}
  }
  async getReservationAmount(reservationId: string): Promise<any> {
    try {
      const amount = await reservationRepository.getReservationAmount(
        reservationId
      );
      return amount?.reservation_amount;
    } catch (error) {}
  }

  async assignEmployeeId(
    employeeId: string,
    reservationId: string
  ): Promise<any> {
    try {
      const result = await reservationRepository.assignEmployeeId(
        employeeId,
        reservationId
      );

      console.log("service part: ", result);
      return result;
    } catch (error) {}
  }
}

export const reservationService = new ReservationService();
