import React, { useEffect, useState } from "react";
import ProductoCard from "./ProductoCard";
import { API_BASE_URL } from "../config";

function SeccionCategoria({ categoria, titulo }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoria) return;

    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/products?categoria=${categoria}&limit=3`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProductos(data.products || []);
      } catch (error) {
        console.error(`Error al cargar productos de ${categoria}:`, error);
        setError(`No se pudieron cargar los productos de ${titulo}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [categoria, titulo]);

  if (loading) return <p className="text-center mt-6">Cargando {titulo}...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;
  if (productos.length === 0) return <p className="text-center mt-6">No hay productos en {titulo}.</p>;

  return (
    <section className="py-8 px-6">
      <h2 className="text-2xl font-bold mb-6">{titulo}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((p) => (
          <ProductoCard key={p.id || p._id} producto={p} />
        ))}
      </div>
    </section>
  );
}

export default SeccionCategoria;
