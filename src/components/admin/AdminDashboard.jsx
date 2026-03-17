import React, { useState } from "react";
import AdminProductos from "./AdminProductos";
import AdminUsuarios from "./AdminUsuarios";
import AdminFrontend from "./AdminFrontend";

const AdminDashboard = () => {
  const [tab, setTab] = useState("productos"); // 'productos', 'usuarios' o 'frontend'

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-body font-semibold mb-6">
        Panel de Administración
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setTab("productos")}
          className={`py-2 px-4 font-body transition ${
            tab === "productos"
              ? "border-b-2 border-pink-500 text-pink-500"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Productos
        </button>

        <button
          onClick={() => setTab("usuarios")}
          className={`py-2 px-4 font-body transition ${
            tab === "usuarios"
              ? "border-b-2 border-pink-500 text-pink-500"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Usuarios
        </button>

        <button
          onClick={() => setTab("frontend")}
          className={`py-2 px-4 font-body transition ${
            tab === "frontend"
              ? "border-b-2 border-pink-500 text-pink-500"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Frontend
        </button>
      </div>

      {/* Contenido según tab */}
      <div>
        {tab === "productos" && <AdminProductos />}
        {tab === "usuarios" && <AdminUsuarios />}
        {tab === "frontend" && <AdminFrontend />}
      </div>
    </div>
  );
};

export default AdminDashboard;
