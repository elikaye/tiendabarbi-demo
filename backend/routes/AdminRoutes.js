// src/routes/AdminRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user, token } = useAuth();

  // Si no hay token, no está logueado
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // Si el usuario NO es admin
  if (!user || user.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Si pasa todo → puede entrar al admin
  return children;
};

export default AdminRoute;
