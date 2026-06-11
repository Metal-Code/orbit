import axios from "axios";

export const TOKEN_KEY = "orbit_token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

const isPublicAuthPath = (url?: string) => {
  if (!url) return false;
  return (
    url.includes("/auth/register") ||
    url.includes("/auth/login") ||
    url.includes("/auth/verify-otp") ||
    url.includes("/auth/resend-otp") ||
    url.includes("/auth/forgot-password") ||
    url.includes("/auth/reset-password")
  );
};

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && !isPublicAuthPath(config.url)) {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      const url: string | undefined = error.config?.url;
      if (!isPublicAuthPath(url)) {
        window.localStorage.removeItem(TOKEN_KEY);
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
