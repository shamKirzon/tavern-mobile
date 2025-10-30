import { axiosInstance } from "../api/axiosInstance";
import { ordersData } from "../types/orders";

export const createOrder = async (order: ordersData) => {
  try {
    const res = await axiosInstance.post("/order/create-order", {
      order,
    });
    if (!res) return console.error("can't create a reservation");

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
