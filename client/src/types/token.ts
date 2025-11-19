export type TokenPayLoad = {
  email: string;
  reservationId?: string;
  orderId?: string;
  employeeId?: string;
  iat: number;
  exp: number;
  jti: string;
};
