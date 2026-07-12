import api from "./axios";

// ===========================
// Auth API
// ===========================

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),

  login: (payload) => api.post("/auth/login", payload),

  logout: () => api.post("/auth/logout"),

  getCurrentUser: () => api.get("/auth/me"),
};

// ===========================
// Departments API
// ===========================

export const departmentsApi = {
  getAll: (params) => api.get("/departments", { params }),

  getById: (id) => api.get(`/departments/${id}`),

  create: (payload) => api.post("/departments", payload),

  update: (id, payload) =>
    api.patch(`/departments/${id}`, payload),

  remove: (id) => api.delete(`/departments/${id}`),
};

// ===========================
// Categories API
// ===========================

export const categoriesApi = {
  getAll: (params) => api.get("/categories", { params }),

  getById: (id) => api.get(`/categories/${id}`),

  create: (payload) => api.post("/categories", payload),

  update: (id, payload) =>
    api.patch(`/categories/${id}`, payload),

  remove: (id) => api.delete(`/categories/${id}`),
};

// ===========================
// Emission Factors API
// ===========================

export const emissionFactorsApi = {
  getAll: (params) =>
    api.get("/emission-factors", { params }),

  getById: (id) =>
    api.get(`/emission-factors/${id}`),

  create: (payload) =>
    api.post("/emission-factors", payload),

  update: (id, payload) =>
    api.patch(`/emission-factors/${id}`, payload),

  remove: (id) =>
    api.delete(`/emission-factors/${id}`),
};

// ===========================
// Carbon Transactions API
// ===========================

export const carbonTransactionsApi = {
  getAll: (params) =>
    api.get("/carbon-transactions", { params }),

  getById: (id) =>
    api.get(`/carbon-transactions/${id}`),

  create: (payload) =>
    api.post("/carbon-transactions", payload),

  update: (id, payload) =>
    api.patch(`/carbon-transactions/${id}`, payload),

  remove: (id) =>
    api.delete(`/carbon-transactions/${id}`),
};

// ===========================
// Dashboard API
// ===========================

export const dashboardApi = {
  getStats: () => api.get("/dashboard"),
};