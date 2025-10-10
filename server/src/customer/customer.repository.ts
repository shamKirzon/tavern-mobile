class CustomerRepository {
  async getCustomerByEmail(email: string) {
    //   const { data, error } = await supabase
    //   .from("customers")
    //   .select("*")
    //   .eq("email", email)
    //   .maybeSingle();
  }

  async addCustomer(email: string) {}

  async deleteCustomer() {}
}

export const customerRepository = new CustomerRepository();
