import { generateToken } from "../utils/token";
import { customerRepository } from "./customer.repository";

class CustomerService {
  async registerCustomer(email: string) {
    let customer = await customerRepository.getCustomerByEmail(email);

    if (!email) customer = await customerRepository.addCustomer(email);

    // return generateToken({ email: email, id: customer.id });
  }
}

export const customerService = new CustomerService();
