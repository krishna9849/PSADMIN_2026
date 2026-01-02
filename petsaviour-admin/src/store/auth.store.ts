import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  hasHydrated: boolean;

  setSession: (s: Session) => void;
  clearSession: () => void;
};

const defaultSession: Session = {
  token: null,
  backendRole: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: defaultSession,
      hasHydrated: false,

      setSession: (session) => set({ session }),

      clearSession: () =>
        set({
          session: defaultSession,
        }),
    }),
    {
      name: "ps_admin_auth",
      storage: createJSONStorage(() => localStorage),

      // Persist ONLY the session (not hydration flag)
      partialize: (state) => ({ session: state.session }),

      // Mark hydration complete
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.hasHydrated = true;
      },
    }
  )
);
