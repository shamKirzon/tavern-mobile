export type TokenPayLoad = {
  email?: string;
  reservationId?: string;
  orderId?: string;
  employeeId?: string;
  reservationCancellationId?: string;
  iat: number;
  exp: number;
  jti: string;
};
