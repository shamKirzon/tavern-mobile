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

export const uploadImage = async (imageUri: string) => {
  try {
    if (!imageUri) return console.log("must have an imageUri");

    const res = await axiosInstance.post("/reservation/upload-image", {
      imageUri,
    });

    return res;
  } catch (error) {
    console.error("error in fe uploadImage()", error);
  }
};
