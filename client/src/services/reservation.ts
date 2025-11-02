import { AxiosInstance } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import { ReservationData, ReservationImageType } from "../types/reservation";
import { getEmailByToken } from "./token";

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

export const uploadImage = async (
  imageUri: string,
  type: ReservationImageType
) => {
  try {
    if (!imageUri) return console.log("must have an imageUri");

    const formData = new FormData();
    const email = await getEmailByToken();

    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: `${email.split("@")[0]}-${type}`,
    } as any);

    formData.append("type", type);

    const res = await axiosInstance.post(
      "/reservation/upload-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!res) return console.error("can't upload image");

    return res.data.imageUrl;
  } catch (error: any) {
    console.error("error in fe uploadImage()", error.message);
  }
};
