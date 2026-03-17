
// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar sesión desde localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (!storedUser || !storedToken) {
        logout();
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      if (storedToken === "null" || storedToken === "undefined") {
        logout();
      } else {
        setUser(parsedUser);
        setToken(storedToken);
      }
    } catch (error) {
      console.error("❌ Error leyendo sesión:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 LOGIN
  const login = (userData, receivedToken) => {
    if (!userData || !receivedToken) return;

    setUser(userData);
    setToken(receivedToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", receivedToken);
  };

  // 🔹 LOGOUT (limpio y seguro)
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user && token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
