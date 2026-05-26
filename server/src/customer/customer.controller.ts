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
      console.log(error.message || `Error registering email `);
    }
  }

  async setInactive(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(400).json({ message: "it must have an email" });

      const customerStatus = await customerService.setStatus(email, false);
      if (!customerStatus)
        return res.status(404).json({ message: "email can't find." });

      return res.status(200).json({
        message: "Customer status set as inactive",
        customerStatus,
      });
    } catch (error: any) {
      console.log(
        error.message || "Can't perform setting status to inactive. "
      );
    }
  }

  async setActive(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(400).json({ message: "it must have an email" });

      const customerStatus = await customerService.setStatus(email, true);
      if (!customerStatus)
        return res.status(404).json({ message: "email can't find." });

      return res.status(200).json({
        message: "customer status set as active",
        customerStatus,
      });
    } catch (error: any) {
      console.log(
        error.message || "Can't perform setting status to inactive. "
      );
    }
  }
}

export const customerController = new CustomerController();
