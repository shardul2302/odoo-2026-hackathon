import api from "../lib/axios";

export const loginUser = (payload) => api.post("/auth/login", payload);
export const registerUser = (payload) => api.post("/auth/register", payload);
export const logoutUser = () => api.post("/auth/logout");
export const getCurrentUser = () => api.get("/auth/me");
