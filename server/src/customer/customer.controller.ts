import { Response, Request } from "express";
import { customerService } from "./customer.service";

class CustomerController {
  async registerCustomer(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(400).json({ message: "it must have an email" });

      const token = await customerService.registerCustomer(email);
      return res.status(201).json({
        message: "token created successfully",
        token,
      });
    } catch (error: any) {
      console.error(error.message || `Error registering email `);
    }
  }
}

export const customerController = new CustomerController();
