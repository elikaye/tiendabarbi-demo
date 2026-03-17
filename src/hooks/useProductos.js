import { useEffect, useState } from "react";
import { CLOUDINARY_BASE_URL } from "../config";

export function useProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/api/v1/products?limit=1000`);
      const data = await res.json();

      const adaptados = (data.products || []).map((p) => ({
        ...p,
        id: p.id || p._id,
        imageUrl:
          p.imageUrl && !p.imageUrl.startsWith("http")
            ? `${CLOUDINARY_BASE_URL}${p.imageUrl}`
            : p.imageUrl,
      }));

      setProductos(adaptados);
      setLoading(false);
    };

    fetchProductos();
  }, []);

  return { productos, loading };
}
