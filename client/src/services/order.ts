import { axiosInstance } from "../api/axiosInstance";
import { ordersData } from "../types/orders";
import { getReservationIdByToken, updateToken } from "./token";
import { getEmailByToken } from "./token";

export const createOrder = async (order: ordersData) => {
  try {
    const email = await getEmailByToken();
    const reservationId = await getReservationIdByToken();
    const res = await axiosInstance.post("/order/create-order", {
      order,
      email,
      reservationId,
    });
    if (!res) return console.log("Can't create a reservation.");

    await updateToken({ orderId: res.data.orderId });

    return res.data.orderId;
  } catch (error) {
    console.error("services/orders/error in createOrder() Error: ", error);
  }
};

export const getOrderData = async (orderId: string) => {
  try {
    const res = await axiosInstance.get(`/order/get-order-data/${orderId}`);
    if (!res) return console.log("Can't create a reservation");

    return res.data.result;
  } catch (error) {
    console.error("services/orders/getOrderData() Error:", error);
  }
};

export const updateOrderItems = async (orderId: string, updatedOrders: any) => {
  try {
    const res = await axiosInstance.post("/order/update-order-items", {
      orderId,
      updatedOrders,
    });
    if (!res) throw new Error("Can't update order items");

    return res.data.result;
  } catch (error) {
    console.error("services/orders/updatedOrderItems() Error:", error);
  }
};

export const assignCashierId = async (employeeId: string, orderId: string) => {
  try {
    const res = await axiosInstance.post("/order/assign-cashier-id", {
      employeeId,
      orderId,
    });
    if (!res)
      return console.error("Error in service/reservation/assignCashierId");

    return res.data.result;
  } catch (error) {
    console.error(
      "Error in services/reservation/assignCashierId(). Error: ",
      error
    );
  }
};

export const completeOrder = async (orderId: string) => {
  try {
    const res = await axiosInstance.post("/order/complete-order", {
      orderId,
    });
    if (!res)
      return console.error("Error in service/reservation/completeOrder");

    return res.data.message;
  } catch (error) {
    console.error(
      "Error in services/reservation/completeOrder(). Error: ",
      error
    );
  }
};
