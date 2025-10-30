import { supabase } from "../lib/supabase-client";

class OrderRepository {
  async createOrder(data: any) {
    try {
      // supabase code:
      const data = "supabase data";

      return data;
    } catch (error: any) {
      console.error("error in createOrder: ", error);
    }
  }
  async getReservationData(email: string) {
    try {
      // supabase stuff
      const data = "supabase stuff";

      return data;
    } catch (error) {
      console.error("error in getting order information: ", error);
    }
  }
}

export const orderRepository = new OrderRepository();
