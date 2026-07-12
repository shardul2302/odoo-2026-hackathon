import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function Auth() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    console.log("Logged in:", userData);
    
    // Navigate to dashboard here if needed
    // Example:
    // navigate("/dashboard");
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    console.log("Registered:", userData);

    // After successful registration go to login
    setPage("login");
  };

  return (
    <>
      {page === "login" && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setPage("register")}
        />
      )}

      {page === "register" && (
        <Register
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => setPage("login")}
        />
      )}
    </>
  );
}