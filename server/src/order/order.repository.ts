import { supabase } from "../lib/supabase-client";

class OrderRepository {
  async createOrder(orderData: any) {
    try {
      const { orderItems, total, reservationId } = orderData;

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
        .eq("order_id", orderId)
        .select()
        .single();

      if (error) return console.error("supabase error in insertQrUrl()", error);

      return data;
    } catch (error) {
      console.error("error repository/insertQrUrl ", error);
    }
  }
}

export const orderRepository = new OrderRepository();
