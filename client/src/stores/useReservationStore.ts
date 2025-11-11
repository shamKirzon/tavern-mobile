import { create } from "zustand";
import { ReservationData, ReservationStore } from "../types/reservation";

export const useReservationStore = create<ReservationStore>((set) => ({
  customerReservationData: {},
  reservationAmount: 0,
  setReservationAmount: (data) => set({ reservationAmount: data }),
  setReservationData: (data) =>
    set((state) => ({
      customerReservationData: { ...state.customerReservationData, ...data },
    })),
  clearReservationData: () => set({ customerReservationData: {} }),
}));
