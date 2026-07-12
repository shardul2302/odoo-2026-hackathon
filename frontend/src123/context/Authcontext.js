
import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ KEY FIX: only call getCurrentUser if token exists
    // Without this, every page load fires a 401 → triggers interceptor → loop
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getCurrentUser()
      .then(({ data }) => setUser(data.data))
      .catch(() => {
        localStorage.removeItem("accessToken");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password });
    if (data?.data?.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (fullName, email, password, role) => {
    await authApi.register({ fullName, email, password, role });
    return login(email, password);
  };

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}