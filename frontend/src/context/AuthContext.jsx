import { createContext, useState } from "react";
import { authApi } from "@/lib/api";

export const AuthContext = createContext();

const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("ecosphereUser");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;

    const storedToken = localStorage.getItem("accessToken");
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      return storedUser;
    }

    return null;
  });

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });

    const payload = response?.data?.data ?? response?.data;
    const userData = payload?.user ?? payload;
    const token = payload?.token;

    if (!userData || !token) {
      throw new Error("Invalid login response from server");
    }

    localStorage.setItem("accessToken", token);
    localStorage.setItem("ecosphereUser", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (payload) => {
    const response = await authApi.register(payload);
    return response?.data ?? response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Logout request failed", error);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("ecosphereUser");
    localStorage.removeItem("demoUser");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: false,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};