import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AUTH_ROUTES = ["/auth/login", "/auth/refresh-token", "/auth/current-user"];

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error) => {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute = AUTH_ROUTES.some((route) =>
      originalRequest.url?.includes(route)
    );

    // ✅ KEY FIX: auth routes just reject cleanly — no refresh attempt
    if (error.response?.status === 401 && isAuthRoute) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh-token");
        if (data?.data?.accessToken) {
          localStorage.setItem("accessToken", data.data.accessToken);
        }
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        localStorage.removeItem("accessToken");

        // ✅ KEY FIX: don't redirect if already on /login or /register
        const onAuthPage =
          window.location.pathname === "/login" ||
          window.location.pathname === "/register";

        if (!onAuthPage) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;