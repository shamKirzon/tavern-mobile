import jwt from "jsonwebtoken";

type TokenPayload = {
  email: string;
  reservationId?: string;
  orderId?: string;
};

class AuthService {
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
}

export const authService = new AuthService();
