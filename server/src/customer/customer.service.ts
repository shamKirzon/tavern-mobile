import { authService } from "../auth/auth.service";
import { customerRepository } from "./customer.repository";
import { formatDateFromSeconds } from "../utils/formatDateFromSeconds";

class CustomerService {
  async registerCustomer(email: string) {
    try {
      let emailExists = await customerRepository.getCustomerByEmail(email);

      if (!emailExists)
        emailExists = await customerRepository.addCustomer(email);

      return authService.generateToken({
        email,
        reservationId: null,
        orderId: null,
      });
    } catch (error: any) {
      console.log(error.message || "Unable to register the customer ", error);
    }
  }

  async setStatus(email: string, isActive: boolean): Promise<any> {
    try {
      let getCustomerByEmail = await customerRepository.getCustomerByEmail(
        email
      );

      if (!getCustomerByEmail) return;

      return await customerRepository.setStatus(email, isActive);
    } catch (error) {}
  }
}

export const customerService = new CustomerService();
