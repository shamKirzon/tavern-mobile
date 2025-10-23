export type ReservationData = {
  email?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  validIdUrl?: string;
  paymentUrl?: string;
  customerId?: string;
  reservationType?: string;
  date?: string;
  pax?: number;
};

export type ReservationImageType = "validId" | "payment";

export interface ReservationStore {
  customerReservationData: ReservationData;
  setReservationData: (data: Partial<ReservationData>) => void;
  clearReservationData: () => void;
}
