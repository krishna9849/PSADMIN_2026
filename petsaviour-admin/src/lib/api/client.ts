import axios, { AxiosError, AxiosInstance } from "axios";
import { useAuthStore } from "../../store/auth.store";
import { toast } from "../ui/toast";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Feature flag:
 * - false by default (since refresh API not available now)
 * - later set NEXT_PUBLIC_ENABLE_REFRESH=true
 */
const ENABLE_REFRESH = process.env.NEXT_PUBLIC_ENABLE_REFRESH === "true";

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Single-flight refresh lock (future use)
 */
let refreshingPromise: Promise<string | null> | null = null;

/**
 * When refresh API is ready, implement this function.
 * For now returns null (because refresh not available).
 */
async function refreshAccessToken(): Promise<string | null> {
  // ✅ feature flag check
  if (!ENABLE_REFRESH) return null;

  // 🚧 Placeholder: implement when refresh endpoint exists
  // Example future implementation:
  // const res = await axios.post(baseURL + EP.auth.refresh, { refreshToken: ... })
  // return res.data?.token || res.data?.accessToken || null

  return null;
}

function clearAndRedirectToLogin() {
  const store = useAuthStore.getState();
  store.clearSession();

  toast.error("Session expired 😿 Please login again");
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}

api.interceptors.request.use((config) => {
  const session = useAuthStore.getState().session;
  const token = session.token;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;

    // If unauthorized
    if (status === 401) {
      // If refresh is disabled -> logout immediately
      if (!ENABLE_REFRESH) {
        clearAndRedirectToLogin();
        return Promise.reject(error);
      }

      // If enabled, try refresh once and retry the original request
      const originalRequest: any = error.config;
      if (originalRequest?._retry) {
        clearAndRedirectToLogin();
        return Promise.reject(error);
      }
      originalRequest._retry = true;

      try {
        if (!refreshingPromise) {
          refreshingPromise = refreshAccessToken().finally(() => {
            refreshingPromise = null;
          });
        }

        const newToken = await refreshingPromise;

        if (!newToken) {
          clearAndRedirectToLogin();
          return Promise.reject(error);
        }

        // Update store with new token (keep existing metadata)
        const store = useAuthStore.getState();
        const current = store.session;

        store.setSession({
          ...current,
          token: newToken,
        });

        // Retry with new token
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (e) {
        clearAndRedirectToLogin();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
