import { create } from "zustand";

export type BackendRole = "admin" | "vendor";

export type Session = {
  token: string | null;
  backendRole: BackendRole | null;
  staffRole?: string | null;
  vendorId?: string | null;
  staffId?: string | null;
  branchId?: string | null;
  email?: string | null;
};

type AuthState = {
  session: Session;
  setSession: (s: Session) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: {
    token: null,
    backendRole: null,
  },

  setSession: (session) => set({ session }),

  clearSession: () =>
    set({
      session: {
        token: null,
        backendRole: null,
      },
    }),
}));
