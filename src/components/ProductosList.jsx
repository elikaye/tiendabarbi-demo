import React, { useEffect, useMemo, useState } from "react";
import ProductoCard from "./ProductoCard";
import { CLOUDINARY_BASE_URL, API_BASE_URL } from "../config";
import { useSearch } from "../context/SearchContext";

const FILAS_MOBILE = 3;
const COLUMNAS_MOBILE = 4;
const MAX_PRODUCTOS = FILAS_MOBILE * COLUMNAS_MOBILE;

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const normalizar = (texto = "") =>
  texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const chunkArray = (arr, chunkSize) => {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};

export default function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [productosHome, setProductosHome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { query } = useSearch();

  const fetchProductos = async () => {
    try {
      console.log("API_BASE_URL:", API_BASE_URL);

      const res = await fetch(`${API_BASE_URL}/products?limit=1000`);
      if (!res.ok) throw new Error("Error cargando productos");

      const data = await res.json();
      const raw = data.products || [];

      const adaptados = raw.map((p) => ({
        ...p,
        id: p.id || p._id,
        imageUrl:
          p.imageUrl && !p.imageUrl.startsWith("http")
            ? `${CLOUDINARY_BASE_URL}${p.imageUrl}`
            : p.imageUrl,
        precio: parseFloat(p.precio) || 0,
      }));

      setProductos(adaptados);
      setProductosHome(shuffle(adaptados).slice(0, MAX_PRODUCTOS));
    } catch (err) {
      console.error("Error cargando productos:", err);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const productosFiltrados = useMemo(() => {
    if (!query) return productosHome;
    const q = normalizar(query);
    return productos.filter(
      (p) =>
        normalizar(p.nombre).includes(q) ||
        normalizar(p.categoria).includes(q)
    );
  }, [query, productos, productosHome]);

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <div className="bg-pink-100 min-h-screen py-6 px-4">
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-xl shadow h-72"
              />
            ))}
        </div>
      ) : productosFiltrados.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-10">
          No se encontraron productos para{" "}
          <span className="font-semibold">“{query}”</span>
        </p>
      ) : (
        <>
          {/* MOBILE */}
          <div className="sm:hidden space-y-4">
            {chunkArray(productosFiltrados, COLUMNAS_MOBILE).map(
              (filaProductos, index) => (
                <div
                  key={index}
                  className="flex space-x-4 overflow-x-auto pb-2"
                  style={{ scrollSnapType: "x mandatory" }}
                >
                  {filaProductos.map((p) => (
                    <div
                      key={p.id}
                      className="flex-shrink-0 w-64"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <ProductoCard producto={p} />
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* DESKTOP */}
          <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((p) => (
              <ProductoCard key={p.id} producto={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
