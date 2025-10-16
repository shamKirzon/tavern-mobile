import { generateToken } from "../utils/token";
import { customerRepository } from "./customer.repository";
import { formatDateFromSeconds } from "../utils/formatDateFromSeconds";

class CustomerService {
  async registerCustomer(email: string) {
    try {
      let emailExists = await customerRepository.getCustomerByEmail(email);

      if (!emailExists)
        emailExists = await customerRepository.addCustomer(email);

      return generateToken({
        email,
      });
    } catch (error: any) {
      console.log(error.message || "Unable to register the customer ", error);
    }
  }
}

export const customerService = new CustomerService();
