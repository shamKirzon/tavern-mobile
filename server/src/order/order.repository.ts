import { supabase } from "../lib/supabase-client";

class OrderRepository {
  async createOrder(orderData: any) {
    try {
      const { orderItems, total, reservationId, qrCodeUrl, cashierId } =
        orderData;

      // last touch: gagana lang to kapag gumamit na tayo ng totoong id ng reservation
      // for session expiry using reservationId/date

      // const sessionExpiry = await supabase
      //   .from("reservations")
      //   .select("date")
      //   .eq("reservation_id", reservationId)
      //   .single();

      const { data, error } = await supabase
        .from("orders")
        .insert([
          {
            total,
            session_expiry: "2025-10-05",
            reservation_id: reservationId,
            order_items: orderItems,
            qr_code_url: qrCodeUrl,
          },
        ])
        .select()
        .single();

      if (error) return console.error("supabase error in createOrder()", error);

      return data;
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
}

export const orderRepository = new OrderRepository();
