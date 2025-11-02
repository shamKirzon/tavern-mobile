export type TokenPayLoad = {
  email: string;
  reservationId?: string;
  orderId?: string;
  iat: number;
  exp: number;
  jti: string;
};
