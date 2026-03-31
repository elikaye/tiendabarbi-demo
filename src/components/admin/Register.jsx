import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!nombre || !email || !password) {
      setErrorMsg("Por favor, completá todos los campos.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/users/register`, {
        nombre,
        email,
        password,
      });

      setSuccessMsg("Registro exitoso. Ahora podés iniciar sesión.");
      setNombre("");
      setEmail("");
      setPassword("");

      setTimeout(() => navigate("/auth"), 2000);
    } catch (error) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Error en el servidor. Intentá más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 px-4 pt-20 sm:pt-24 pb-12 min-h-screen text-gray-700 font-medium">
      <div className="mx-auto w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-medium text-center mb-6">
          Registrarse
        </h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-400 p-2 rounded mb-4 text-center text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-100 text-green-600 p-2 rounded mb-4 text-center text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NOMBRE */}
          <div>
            <label className="block font-medium mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block font-medium mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block font-medium mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {mostrarPassword ? (
                  <RiEyeOffLine size={22} />
                ) : (
                  <RiEyeLine size={22} />
                )}
              </button>
            </div>
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-blue-300 transition disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          {/* LOGIN */}
          <p className="text-center text-sm mt-4">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/auth"
              className="text-pink-300 font-medium hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;