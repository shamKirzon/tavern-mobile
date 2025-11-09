import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;

  showEmailVerifiedToggle: boolean;
  setShowEmailVerifiedToggle: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  showEmailVerifiedToggle: false,

  setIsAuthenticated: (value: any) => set({ isAuthenticated: value }),
  setShowEmailVerifiedToggle: (value: boolean) =>
    set({ showEmailVerifiedToggle: value }),
}));
