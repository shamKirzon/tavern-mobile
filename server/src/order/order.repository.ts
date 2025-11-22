import { STATUS_CODES } from "http";
import { supabase } from "../lib/supabase-client";

class OrderRepository {
  async createOrder(orderData: any, reservationId: string) {
    try {
      const { orderItems, total } = orderData;

      const { data: reservationDate, error: reservationDateError } =
        await supabase
          .from("reservations")
          .select("date")
          .eq("reservation_id", reservationId)
          .single();

      if (reservationDateError) throw reservationDateError;

      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .insert([
          {
            total,
            session_expiry: reservationDate?.date,
            reservation_id: reservationId,
            order_items: orderItems,
          },
        ])
        .select()
        .single();

      if (ordersError) throw ordersError;

      return orders.order_id;
    } catch (error: any) {
      console.error("error in createOrder: ", error);
    }
  }
  async getOrderData(orderId: string) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_id", orderId)
        .single();

      if (error)
        return console.error("supabase error in getOrderData()", error);

      return data;
    } catch (error) {
      console.error("error in getting order information: ", error);
    }
  }

  async insertQrUrl(qrUrl: string, orderId: string) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update([
          {
            qr_code_url: qrUrl,
          },
        ])
        .eq("order_id", orderId);

      if (error) return console.error("supabase error in insertQrUrl()", error);
    } catch (error) {
      console.error("error repository/insertQrUrl ", error);
    }
  }

  async updateOrderItems(orderId: string, updatedOrders: any) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update([
          {
            order_items: updatedOrders,
          },
        ])
        .eq("order_id", orderId)
        .select()
        .single();

      if (error)
        return console.error("supabase error in updateOrderItems()", error);

      return data.order_items;
    } catch (error) {
      console.error("error repository/updateOrderItems() ", error);
    }
  }

  async assignCashierId(employeeId: string, orderId: string) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .update({ assigned_cashier_id: employeeId })
        .eq("order_id", orderId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("reservationRepository/assignnCashierId ", error);
    }
  }
  async completeOrder(orderId: string) {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .update({ order_status: "done" })
        .eq("order_id", orderId)
        .select()
        .single();

      const { data: reservationIdData, error: reservationIdError } =
        await supabase
          .from("orders")
          .select("reservation_id")
          .eq("order_id", orderId)
          .single();

      const reservationId = reservationIdData?.reservation_id;

      const { data: reservationData, error: reservationError } = await supabase
        .from("reservations")
        .update({ reservation_status: "done" })
        .eq("reservation_id", reservationId)
        .select()
        .single();

      if (orderError || reservationIdError || reservationError) {
        throw orderError || reservationIdError || reservationError;
      }

      return { orderData, reservationData };
    } catch (error) {
      console.error("reservationRepository/assignnCashierId ", error);
    }
  }
}

export const orderRepository = new OrderRepository();
