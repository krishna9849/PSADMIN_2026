import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { EP } from "./endpoints";
import { tokenStore } from "../auth/tokens";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL,
  timeout: 30000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return null;

  try {
    // Assumption: refresh token is sent in body; adjust if your API uses cookie/header.
    const res = await axios.post(
      `${baseURL}${EP.auth.refresh}`,
      { refreshToken },
      { timeout: 30000 }
    );

    // Assumption: { accessToken, refreshToken? }
    const newAccess = res.data?.accessToken || res.data?.token || null;
    const newRefresh = res.data?.refreshToken || null;

    if (newAccess) tokenStore.setAccessToken(newAccess);
    if (newRefresh) tokenStore.setRefreshToken(newRefresh);

    return newAccess;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as any;
    const status = err.response?.status;

    if (status !== 401 || original?._retry) {
      return Promise.reject(err);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) return reject(err);
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;

    const newToken = await refreshAccessToken();

    isRefreshing = false;
    flushQueue(newToken);

    if (!newToken) {
      tokenStore.clearAll();
      if (typeof window !== "undefined") window.location.href = "/";
      return Promise.reject(err);
    }

    original.headers.Authorization = `Bearer ${newToken}`;
    return api(original);
  }
);
