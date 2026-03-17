import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config.jsx";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_BASE_URL}/users`, axiosConfig);

      const data =
        Array.isArray(res.data)
          ? res.data
          : res.data.users
          ? res.data.users
          : res.data.data
          ? res.data.data
          : [];

      setUsuarios(data);
    } catch (err) {
      console.error("❌ Error al cargar usuarios:", err);
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    const confirmacion = window.confirm(
      "¿Seguro que querés eliminar este usuario? Esta acción no se puede deshacer."
    );
    if (!confirmacion) return;

    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`, axiosConfig);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("❌ Error al eliminar usuario:", err);
      alert("No se pudo eliminar el usuario.");
    }
  };

  return (
    <div className="p-4 pt-20 md:p-6 md:pt-32 max-w-6xl mx-auto">
      <h2 className="text-2xl font-body font-semibold mb-6">
        Administrar usuarios
      </h2>

      {loading && <p>Cargando usuarios…</p>}
      {error && <p className="text-red-600 font-body">{error}</p>}

      {!loading && usuarios.length === 0 && (
        <p>No hay usuarios registrados.</p>
      )}

      <ul className="space-y-4">
        {usuarios.map((u) => (
          <li
            key={u.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border rounded font-body p-4"
          >
            <div className="text-sm sm:text-base">
              <p className="font-semibold">{u.nombre}</p>
              <p>{u.email}</p>
              <p className="text-sm text-gray-600">Rol: {u.rol}</p>
            </div>

            <button
              onClick={() => eliminarUsuario(u.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-body w-full sm:w-auto"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsuarios;
