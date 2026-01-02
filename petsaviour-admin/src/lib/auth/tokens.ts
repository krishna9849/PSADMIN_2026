export type AuthRole = "admin" | "vendor" | "staff";

const ACCESS_TOKEN_KEY = "ps_access_token";
const REFRESH_TOKEN_KEY = "ps_refresh_token";
const ROLE_KEY = "ps_role";

export const tokenStore = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clearRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  getRole(): AuthRole | null {
    if (typeof window === "undefined") return null;
    const v = localStorage.getItem(ROLE_KEY);
    if (v === "admin" || v === "vendor" || v === "staff") return v;
    return null;
  },
  setRole(role: AuthRole) {
    localStorage.setItem(ROLE_KEY, role);
  },
  clearRole() {
    localStorage.removeItem(ROLE_KEY);
  },

  clearAll() {
    this.clearAccessToken();
    this.clearRefreshToken();
    this.clearRole();
  },
};
