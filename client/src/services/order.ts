import { axiosInstance } from "../api/axiosInstance";
import { ordersData } from "../types/orders";
import { getReservationIdByToken, updateToken } from "./token";
import { getEmailByToken } from "./token";

export const createOrder = async (order: ordersData) => {
  try {
    console.log("from create order: ", order);
    const email = await getEmailByToken();
    const reservationId = await getReservationIdByToken();
    const res = await axiosInstance.post("/order/create-order", {
      order,
      email,
      reservationId,
    });
    if (!res) return console.error("can't create a reservation");

    await updateToken({ orderId: res.data.orderId });

    return res.data.orderId;
  } catch (error) {
    console.error("services/orders/error in createOrder() Error: ", error);
  }
};

export const getOrderData = async (orderId: string) => {
  try {
    const res = await axiosInstance.get(`/order/get-order-data/${orderId}`);
    if (!res) return console.error("can't create a reservation");

    console.log("MY DATA FROM BACKEND: ", res.data.result);
    return res.data.result;
  } catch (error) {
    console.error("services/orders/getOrderData() Error:", error);
  }
};
