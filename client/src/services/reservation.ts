import { AxiosInstance } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import { ReservationData } from "../types/reservation";

export const createReservation = async (data: ReservationData) => {
  try {
    const res = await axiosInstance.post("/reservation/create-reservation", {
      data,
    });
    if (!res) return console.error("can't create a reservation");

    console.info("Reservation Created:", data);
  } catch (error) {
    console.error("error in createReservation(). Error: ", error);
  }
};
