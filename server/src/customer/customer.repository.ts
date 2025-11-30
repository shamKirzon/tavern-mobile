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
        console.error("Data query failed in getting customer email.", error);
        return null;
      }

      return data;
    } catch (error: any) {
      console.error(
        "Error in customerRepository/getCustomerByEmail() ",
        error.message
      );
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
        console.error("Data query failed in inserting customer email ", error);
        return null;
      }

      return data;
    } catch (error: any) {
      console.error(
        "Error in customerRepository/addCustomer(): ",
        error.message
      );
    }
  }

  async deleteCustomer() {}

  async setStatus(email: string, isActive: boolean) {
    try {
      const customerId = await supabase
        .from("customers")
        .select("customer_id")
        .eq("email", email)
        .single();

      const { data, error } = await supabase
        .from("customers")
        .update({ is_active: isActive })
        .eq("customer_id", customerId.data?.customer_id)
        .select()
        .single();

      if (error) {
        console.error(
          "Data query failed setting customer status to inactive ",
          error
        );
        return null;
      }

      return data;
    } catch (error: any) {
      console.error(
        "Error in customerRepository/addCustomer(): ",
        error.message
      );
    }
  }
}

export const customerRepository = new CustomerRepository();
