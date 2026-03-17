// src/components/admin/Auth.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/users/login`,
        { email, password },
        { withCredentials: false }
      );

      const { token, user } = data;

      if (!token || !user) {
        throw new Error("Respuesta inválida del servidor");
      }

      login(user, token);

      // 🔹 Redirección segura
      if (user.rol === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("❌ Error en login:", error);

      if (error.response?.status === 401) {
        setErrorMsg("Credenciales incorrectas.");
      } else if (error.response?.status === 404) {
        setErrorMsg("Usuario no encontrado.");
      } else {
        setErrorMsg("Error al intentar iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 px-4 pt-20 sm:pt-24 pb-12 min-h-screen">
      <div className="mx-auto w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Iniciar sesión
        </h2>

        {errorMsg && (
          <p className="text-red-600 text-center mb-4 text-sm">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="block font-body font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block font-body font-semibold mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {/* RECUPERAR CONTRASEÑA */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-pink-500 font-body font-semibold hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 active:bg-black transition-colors text-white font-body font-semibold py-3 rounded-lg disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {/* REGISTER */}
          <p className="text-center text-sm mt-4">
            ¿No tenés cuenta?{" "}
            <Link
              to="/register"
              className="text-pink-500 font-body font-semibold"
            >
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
