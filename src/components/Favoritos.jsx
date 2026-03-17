// src/components/Favoritos.jsx
import React, { useEffect, useState } from "react";
import { useFavoritos } from "../context/FavoritosContext";
import ProductoCard from "./ProductoCard";

const COLUMNAS_MOBILE = 4;

const chunkArray = (arr = [], chunkSize) => {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};

const Favoritos = () => {
  const { favoritos, eliminarFavorito } = useFavoritos();
  const [syncingIds, setSyncingIds] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Maneja la eliminación con control de estado para evitar el bug
  const handleEliminar = async (productoId) => {
    if (syncingIds.includes(productoId)) return;

    setSyncingIds((prev) => [...prev, productoId]);
    try {
      await eliminarFavorito(productoId);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingIds((prev) => prev.filter((id) => id !== productoId));
    }
  };

  if (!Array.isArray(favoritos)) return <p className="p-4">Cargando favoritos...</p>;

  const favoritosFiltrados = favoritos.filter((p) => !syncingIds.includes(p.id));

  if (!favoritosFiltrados.length) return <p className="p-4">No tenés productos favoritos aún.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Mis Favoritos ❤️</h2>

      {/* 📱 MOBILE — scroll horizontal por filas */}
      <div className="sm:hidden space-y-4">
        {chunkArray(favoritosFiltrados, COLUMNAS_MOBILE).map((fila, index) => (
          <div
            key={index}
            className="flex space-x-4 overflow-x-auto pb-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {fila.map((producto) => (
              <div
                key={producto.id}
                className="flex-shrink-0 w-64"
                style={{ scrollSnapAlign: "start" }}
              >
                <ProductoCard
                  producto={producto}
                  onEliminar={() => handleEliminar(producto.id)}
                  disabled={syncingIds.includes(producto.id)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 🖥 DESKTOP — grid normal */}
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoritosFiltrados.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            onEliminar={() => handleEliminar(producto.id)}
            disabled={syncingIds.includes(producto.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Favoritos;
