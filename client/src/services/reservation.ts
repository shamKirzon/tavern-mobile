import { AxiosInstance } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import { ReservationData, ReservationImageType } from "../types/reservation";
import { getEmailByToken } from "./token";
import { updateToken } from "./token";

export const createReservation = async (data: ReservationData) => {
  try {
    const res = await axiosInstance.post("/reservation/create-reservation", {
      data,
    });
    if (!res) return console.error("can't create a reservation");

    const reservationId = res.data;
    // updating token part:
    await updateToken({ reservationId });
  } catch (error) {
    console.error("services/reservation/createReservation(). Error: ", error);
  }
};

export const uploadImage = async (
  imageUri: string,
  type: ReservationImageType
) => {
  try {
    if (!imageUri) return console.log("It must have an imageUri");

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
    console.error("services/reservation/uploadImage()", error.message);
  }
};
