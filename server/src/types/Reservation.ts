export type ReservationData = {
  email?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  validIdUrl?: string;
  paymentUrl?: string;
  reservationType?: string;
  date?: string;
  pax?: number;
  reservationAmount: number;
};

export type ReservationImageType = "payment" | "validId";
