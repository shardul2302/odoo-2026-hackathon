import { createContext, useState } from "react";
import { authApi } from "@/lib/api";


export const AuthContext = createContext();

// Demo credentials for local UI testing only.
const DEMO_USERS = [
  {
    _id: "demo-admin",
    name: "EcoSphere Admin",
    email: "admin@ecosphere.com",
    password: "Admin123!",
    role: "Admin",
    department: { name: "Operations" },
  },
  {
    _id: "demo-employee",
    name: "EcoSphere Employee",
    email: "employee@ecosphere.com",
    password: "Employee123!",
    role: "Employee",
    department: { name: "People & Culture" },
  },
  {
    _id: "demo-manager",
    name: "EcoSphere Manager",
    email: "manager@ecosphere.com",
    password: "Manager123!",
    role: "Manager",
    department: { name: "Finance" },
  },
];

const getDemoUser = (email, password) => {
  const normalizedEmail = email?.trim().toLowerCase();
  return DEMO_USERS.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
  );
};

export const AuthProvider = ({children}) => {

 const [user,setUser] = useState(() => {
    if (typeof window === "undefined") return null;

    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("demoUser");

    if (storedToken || storedUser) {
      try {
        return storedUser ? JSON.parse(storedUser) : DEMO_USERS[0];
      } catch {
        return DEMO_USERS[0];
      }
    }

    return null;
 });


 const login = async(email,password)=>{

    const demoUser = getDemoUser(email, password);

    if (demoUser) {
      localStorage.setItem("accessToken", `demo-${demoUser.role.toLowerCase()}-token`);
      localStorage.setItem("demoUser", JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }

    try {
      const response = await authApi.login({
          email,
          password
      });

      const payload = response?.data?.data ?? response?.data;
      const userData = payload?.user ?? payload;
      const token = payload?.token;

      if (!userData || !token) {
        throw new Error("Invalid login response from server");
      }

      localStorage.setItem(
          "accessToken",
          token
      );

      setUser(userData);

      return userData;
    } catch (error) {
      throw error;
    }

 };


 const register = async(payload)=>{

    const response =
       await authApi.register(payload);

    return response?.data ?? response;

 };


 const logout = async()=>{

    try {
        await authApi.logout();
    } catch (error) {
        console.warn("Logout request failed", error);
    }

    localStorage.removeItem(
       "accessToken"
    );
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
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
 );

};