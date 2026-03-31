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

  if (!Array.isArray(favoritos)) {
    return (
      <div className="min-h-screen pt-32 md:pt-36 px-4 bg-white text-gray-700 font-medium">
        <p>Cargando favoritos...</p>
      </div>
    );
  }

  const favoritosFiltrados = favoritos.filter(
    (p) => !syncingIds.includes(p.id)
  );

  if (!favoritosFiltrados.length) {
    return (
      <div className="min-h-screen pt-32 md:pt-36 px-4 bg-white flex flex-col items-center justify-center text-gray-700 font-medium">
        <p className="text-lg">No tenés productos favoritos aún 💖</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 md:pt-36 pb-20 px-4 bg-white text-gray-700">
      
      <h2 className="text-2xl font-medium mb-6 text-gray-700 text-center md:text-left">
        Mis Favoritos
      </h2>

      {/* 📱 MOBILE */}
      <div className="sm:hidden space-y-4">
        {chunkArray(favoritosFiltrados, COLUMNAS_MOBILE).map((fila, index) => (
          <div
            key={index}
            className="flex gap-4 overflow-x-auto pb-2 pr-2"
          >
            {fila.map((producto) => (
              <div key={producto.id} className="flex-shrink-0 w-64">
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

      {/* 🖥 DESKTOP */}
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