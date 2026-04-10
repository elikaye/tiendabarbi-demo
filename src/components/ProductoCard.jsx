import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useFavoritos } from "../context/FavoritosContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CLOUDINARY_BASE_URL } from "../config";

const ProductoCard = ({ producto }) => {
  const [loaded, setLoaded] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [hearts, setHearts] = useState([]);

  const { user } = useAuth();
  const { favoritos, agregarFavorito, eliminarFavorito } = useFavoritos();

  if (!producto) return null;

  // 🔥 FIX CLAVE: ID consistente
  const productId = producto.id || producto._id;

  const esActivo = producto.estado === "activo";

  const isFavorito = Array.isArray(favoritos)
    ? favoritos.some((f) =>
        (
          f?.producto_id ||
          f?.producto?.id ||
          f?.id ||
          f?._id
        )?.toString() === productId?.toString()
      )
    : false;

  const lanzarCorazones = () => {
    const nuevos = [
      { id: Date.now(), x: -12, scale: 0.9 },
      { id: Date.now() + 1, x: 0, scale: 1 },
      { id: Date.now() + 2, x: 12, scale: 1.1 }
    ];

    setHearts(nuevos);
    setTimeout(() => setHearts([]), 500);
  };

  const toggleFavorito = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loadingFav) return;

    if (!user) {
      toast.info("💖 Iniciá sesión para guardar tus favoritos");
      return;
    }

    setLoadingFav(true);

    try {
      if (isFavorito) {
        await eliminarFavorito(productId);
      } else {
        await agregarFavorito(producto);
        lanzarCorazones();
      }
    } catch {
      toast.error("No se pudo actualizar favoritos");
    } finally {
      setLoadingFav(false);
    }
  };

  const imgSrc = producto.imageUrl
    ? producto.imageUrl.startsWith("http")
      ? producto.imageUrl
      : `${CLOUDINARY_BASE_URL}${producto.imageUrl}`
    : "/placeholder.png";

  const precioFormateado = new Intl.NumberFormat("es-AR").format(
    producto.precio
  );

  return (
    <Link
      to={`/products/${productId}`} // 🔥 FIX ACÁ
      className="
        relative bg-white rounded-xl
        shadow-md hover:shadow-lg
        transition-all duration-300
        p-3 flex flex-col
      "
    >
      {/* ❤️ BOTÓN FAVORITO */}
      <button
        onClick={toggleFavorito}
        className={`absolute top-3 right-3 z-20 ${
          isFavorito
            ? "text-pink-200"
            : "text-gray-700 hover:text-pink-200"
        }`}
      >
        <FaHeart size={18} />
      </button>

      {/* ❤️ CORAZONES ANIMADOS */}
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute right-4 text-pink-200 text-xs pointer-events-none"
          style={{
            top: "20px",
            transform: `translateX(${h.x}px) scale(${h.scale})`,
            animation: "subir 0.5s ease-out forwards"
          }}
        >
          ❤️
        </span>
      ))}

      {/* 🖼️ IMAGEN */}
      <div className="flex justify-center items-center h-60 mb-2">
        <img
          src={imgSrc}
          alt={producto.nombre}
          className={`
            max-h-full object-contain
            transition-all duration-300
            ${loaded ? "opacity-100" : "opacity-0"}
            hover:scale-105
          `}
          onLoad={() => setLoaded(true)}
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        />
      </div>

      {/* 📝 TEXTO */}
      <h3 className="font-medium text-gray-700 text-sm line-clamp-2">
        {producto.nombre}
      </h3>

      <p className="text-gray-700 text-xs line-clamp-2">
        {producto.descripcion}
      </p>

      <p className="text-gray-700 font-medium text-base mt-1">
        ${precioFormateado}
      </p>

      {/* 🔘 BOTÓN */}
      {esActivo ? (
        <div className="mt-3 flex justify-center">
          <span
            className="
              px-5 py-2 text-sm
              font-medium
              border border-pink-200
              text-gray-700
              hover:bg-pink-100
              transition-all duration-200
              cursor-pointer
            "
          >
            Ver producto
          </span>
        </div>
      ) : (
        <p className="mt-2 text-xs text-gray-500 italic text-center">
          Producto sin stock
        </p>
      )}
    </Link>
  );
};

export default ProductoCard;