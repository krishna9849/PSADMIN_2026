import { create } from "zustand";
import { tokenStore, AuthRole } from "../lib/auth/tokens";

type AuthState = {
  role: AuthRole | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (p: { role: AuthRole; accessToken: string; refreshToken?: string | null }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: tokenStore.getRole(),
  accessToken: tokenStore.getAccessToken(),
  refreshToken: tokenStore.getRefreshToken(),

  setSession: ({ role, accessToken, refreshToken }) => {
    tokenStore.setRole(role);
    tokenStore.setAccessToken(accessToken);
    if (refreshToken) tokenStore.setRefreshToken(refreshToken);

    set({
      role,
      accessToken,
      refreshToken: refreshToken ?? tokenStore.getRefreshToken(),
    });
  },

  clearSession: () => {
    tokenStore.clearAll();
    set({ role: null, accessToken: null, refreshToken: null });
  },
}));
