import { AxiosInstance } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import { ReservationData, ReservationImageType } from "../types/reservation";
import { getEmailByToken } from "./token";
import { updateToken } from "./token";
import { EmployeeRole } from "../types/employee";

export const createReservation = async (data: ReservationData) => {
  try {
    const res = await axiosInstance.post("/reservation/create-reservation", {
      data,
    });
    if (!res) return console.log("Can't create a reservation.");

    const reservationId = res.data;

    await updateToken({ reservationId });
    return reservationId;
  } catch (error) {
    console.log("Error in services/reservation/createReservation():", error);
  }
};

export const getReservationStatus = async (reservationId: string) => {
  try {
    const res = await axiosInstance.get(
      `/reservation/get-reservation-status/${reservationId}`
    );
    if (!res) return console.log("Can't get reservation status.");

    return res.data.status;
  } catch (error) {
    console.log(
      "Error in services/reservation/getReservationStatus(): ",
      error
    );
  }
};

export const getReservationAmount = async (reservationId: string) => {
  try {
    const res = await axiosInstance.get(
      `/reservation/get-reservation-amount/${reservationId}`
    );
    if (!res) return console.log("Can't get reservation status");

    return res.data.amount;
  } catch (error) {
    console.log("Error in services/reservation/getReservationStatus()", error);
  }
};

export const getReservationData = async (reservationId: string) => {
  try {
    const res = await axiosInstance.get(
      `/reservation/get-reservation-data/${reservationId}`
    );
    if (!res) return console.log("Can't get reservation data ");

    return res.data.result;
  } catch (error) {
    console.log("Error in services/reservation/getReservationData()", error);
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

    if (!res) return console.log("Can't upload image");

    return res.data.imageUrl;
  } catch (error: any) {
    console.log("Error in services/reservation/uploadImage()", error.message);
  }
};

export const assignSecurityId = async (
  employeeId: string,
  reservationId: string
) => {
  try {
    const res = await axiosInstance.post("/reservation/assign-security-id", {
      employeeId,
      reservationId,
    });
    if (!res) return console.log("Can't assign security id.");

    return res.data.result;
  } catch (error) {
    console.log("Error in services/reservation/getReservationData()", error);
  }
};
