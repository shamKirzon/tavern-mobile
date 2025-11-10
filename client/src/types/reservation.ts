export type ReservationData = {
  email?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  validIdUrl?: string;
  paymentUrl?: string;
  reservationType?: string;
  date?: Date;
  pax?: number;
  reservationAmount?: number;
};

export type ReservationImageType = "validId" | "payment";

export interface ReservationStore {
  customerReservationData: ReservationData;
  setReservationData: (data: Partial<ReservationData>) => void;
  clearReservationData: () => void;
}
