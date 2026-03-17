
// src/pages/FavoritosPage.jsx
import React, { useEffect } from "react";
import { useFavoritos } from "../context/FavoritosContext";
import ProductoCard from "../components/ProductoCard";

const COLUMNAS_MOBILE = 4; // cantidad de cards por fila en mobile

// Divide el array en filas
const chunkArray = (arr, chunkSize) => {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};

const FavoritosPage = () => {
  const { favoritos, loading } = useFavoritos();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando favoritos...</p>;

  const favoritosLimpios = (favoritos || []).filter(
    (p) => p && (p.id !== undefined && p.id !== null)
  );

  if (!favoritosLimpios || favoritosLimpios.length === 0)
    return <p className="text-center mt-10">No tenés favoritos aún 😢</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6"></h2>

      {/* MOBILE — scroll horizontal con snap */}
      <div className="sm:hidden space-y-4">
        {chunkArray(favoritosLimpios, COLUMNAS_MOBILE).map((fila, index) => (
          <div
            key={index}
            className="flex space-x-4 overflow-x-auto pb-2 scrollbar-none"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {fila.map((producto) => (
              <div
                key={producto.id}
                className="flex-shrink-0 w-56" // cards más pequeñas
                style={{ scrollSnapAlign: "start" }}
              >
                <ProductoCard producto={producto} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* DESKTOP — grid normal */}
      <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoritosLimpios.map((producto) => (
          <ProductoCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
};

export default FavoritosPage;
