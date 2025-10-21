import { create } from "zustand";
import { ReservationData, ReservationStore } from "../types/reservation";

export const useReservationStore = create<ReservationStore>((set) => ({
  customerReservationData: {},
  setReservationData: (data) =>
    set((state) => ({
      customerReservationData: { ...state.customerReservationData, ...data },
    })),
  clearReservationData: () => set({ customerReservationData: {} }),
}));
