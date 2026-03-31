import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.info("Ingresá tu email");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/forgot-password`,
        { email }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEmail("");
      } else {
        toast.error("No se pudo procesar la solicitud");
      }
    } catch (err) {
      console.error("Error forgot password:", err);
      toast.error("No se pudo procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 px-4 pt-20 sm:pt-24 pb-12 min-h-screen text-gray-700 font-medium">
      <div className="mx-auto w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-medium text-center mb-4">
          Recuperar contraseña
        </h2>

        <p className="text-sm text-gray-500 mb-6 text-center">
          Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-pink-300 transition disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>

        </form>

        <p className="text-center text-sm mt-6">
          ¿Ya recordaste tu contraseña?{" "}
          <Link
            to="/auth"
            className="text-pink-300 font-medium hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ForgotPassword;