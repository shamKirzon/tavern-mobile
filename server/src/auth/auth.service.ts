import jwt from "jsonwebtoken";

interface OtpValidationResult {
  isExpired: boolean | undefined;
  isValid: boolean | undefined;
}

type TokenPayload = {
  email: string;
  reservationId?: string | null;
  orderId?: string | null;
};

class AuthService {
  private otps: Record<string, { otp: string; expireAt: number }> = {};

  async updateToken(oldToken: string, update: Partial<any>) {
    try {
      const { v4: uuidv4 } = await import("uuid");

      const decode = jwt.verify(oldToken, process.env.TOKEN_SECRET_KEY!) as any;

      console.log("decode in updateToken: ", decode);

      const newPayload: TokenPayload = {
        ...decode,
        ...update,
      };

      console.info("newPayload information", newPayload);

      const token = jwt.sign(newPayload, process.env.TOKEN_SECRET_KEY!);

      return token;
    } catch (error: any) {
      console.error(error.message || `Error in updating the token `);
    }
  }

  async generateToken(data: any) {
    const { v4: uuidv4 } = await import("uuid");

    const payload: TokenPayload = {
      email: data.email,
      reservationId: data.reservationId,
      orderId: data.orderId,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY!, {
      expiresIn: "5d",
      jwtid: uuidv4(),
    });

    return token;
  }

  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expireAt = Date.now() + 3 * 60 * 1000;

    this.otps[email] = { otp, expireAt };

    return otp;
  }

  async validateOtp(email: string, otp: string): Promise<OtpValidationResult> {
    const record = this.otps[email];

    if (!record) return { isExpired: true, isValid: false };
    if (record?.expireAt < Date.now()) {
      return { isExpired: true, isValid: false };
    }
    if (parseInt(otp) !== parseInt(record.otp)) {
      return { isExpired: false, isValid: false };
    }

    delete this.otps[email];
    return { isExpired: false, isValid: true };
  }
}

export const authService = new AuthService();
