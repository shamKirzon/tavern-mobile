import { ReservationData, ReservationImageType } from "../types/Reservation";
import { reservationRepository } from "./reservation.repository";

class ReservationService {
  async createReservation(data: ReservationData): Promise<any> {
    try {
      return await reservationRepository.createReservation(data);
    } catch (error) {
      console.log("Error in createReservation(): ", error);
    }
  }

  async getReservationData(reservationId: string): Promise<any> {
    try {
      return await reservationRepository.getReservationData(reservationId);
    } catch (error: any) {
      console.log("Error in getting reservation information: ", error);
    }
  }

  async getReservationStatus(reservationId: string): Promise<any> {
    try {
      const status =
        await reservationRepository.getReservationStatus(reservationId);
      return status?.reservation_status;
    } catch (error) {}
  }
  async getReservationAmount(reservationId: string): Promise<any> {
    try {
      const amount =
        await reservationRepository.getReservationAmount(reservationId);
      return amount?.reservation_amount;
    } catch (error) {}
  }

  async assignSecurityId(
    employeeId: string,
    reservationId: string,
  ): Promise<any> {
    try {
      const result = await reservationRepository.assignSecurityId(
        employeeId,
        reservationId,
      );

      return result;
    } catch (error) {}
  }

  async createCancellation(
    reservationId: string,
    reason: string,
    notes: string,
  ): Promise<any> {
    try {
      const result = await reservationRepository.createCancellation(
        reservationId,
        reason,
        notes,
      );

      return result;
    } catch (error) {}
  }

  async getCancellationData(reservationCancellationId: string): Promise<any> {
    try {
      const result = await reservationRepository.getCancellationData(
        reservationCancellationId,
      );

      return result;
    } catch (error) {}
  }

  async getBookingDays(): Promise<any> {
    try {
      const result = await reservationRepository.getBookingDays();
      return result;
    } catch (error) {}
  }
}

export const reservationService = new ReservationService();
