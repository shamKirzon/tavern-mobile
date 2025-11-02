import { axiosInstance } from "../api/axiosInstance";
import { ordersData } from "../types/orders";
import { updateToken } from "../utils/token";
import { getEmailByToken } from "./token";

export const createOrder = async (order: ordersData) => {
  try {
    const email = getEmailByToken();
    const res = await axiosInstance.post("/order/create-order", {
      order,
      email,
    });
    if (!res) return console.error("can't create a reservation");

    await updateToken({ reservationId: "", orderId: "" });

    console.info("Order Created:", res);
  } catch (error) {
    console.error("error in createOrder(). Error: ", error);
  }
};

export const getOrderData = async (orderId: string) => {
  try {
    const res = await axiosInstance.get("/order/get-order-data/${orderId}");
    if (!res) return console.error("can't create a reservation");

    console.info("orders data: ", res);
  } catch (error) {
    console.error("error in createReservation(). Error: ", error);
  }
};
