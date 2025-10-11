import { supabase } from "../lib/supabase-client";

class CustomerRepository {
  async getCustomerByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        console.log("data query failed in getting customer email ", error);
        return null;
      }

      return data;
    } catch (error: any) {
      console.error("Error from getCustomerByEmail(): ", error.message);
    }
  }

  async addCustomer(email: string) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .insert([{ email }])
        .select()
        .single();

      if (error) {
        console.log("data query failed in inserting customer email ", error);
        return null;
      }

      return data;
    } catch (error: any) {
      console.error("Error from addCustomer(): ", error.message);
    }
  }

  async deleteCustomer() {}
}

export const customerRepository = new CustomerRepository();
