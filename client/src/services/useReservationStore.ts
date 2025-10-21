import { create } from "zustand";

interface ReservationData {
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
}

interface ReservationStore {
  customerReservationData: ReservationData;
  setReservationData: (data: Partial<ReservationData>) => void;
  clearReservationData: () => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  customerReservationData: {},
  setReservationData: (data) =>
    set((state) => ({
      customerReservationData: { ...state.customerReservationData, ...data },
    })),
  clearReservationData: () => set({ customerReservationData: {} }),
}));

// last touch: then aralin mo yung sinabi ni chatgpt kung anong purpose niyan
// sa part ng "state"

//
