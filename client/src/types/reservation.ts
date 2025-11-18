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
  paymentReferenceNumber?: string;
  paymentAmount?: number;
};

export type ReservationImageType = "validId" | "payment";

export interface ReservationStore {
  reservationAmount: number;
  setReservationAmount: (data: number) => void;
  customerReservationData: ReservationData;
  setReservationData: (data: Partial<ReservationData>) => void;
  clearReservationData: () => void;
}

export type ReservationStatus =
  | "none"
  | "pending"
  | "accepted"
  | "rejected"
  | "done";
