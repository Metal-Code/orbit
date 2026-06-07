import { a as axios } from "../_libs/axios.mjs";
const TOKEN_KEY = "devcycle_token";
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" }
});
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
export {
  TOKEN_KEY as T,
  api as a
};
