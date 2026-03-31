import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useFavoritos } from "../context/FavoritosContext";
import { toast } from "react-toastify";
import { API_BASE_URL, CLOUDINARY_BASE_URL } from "../config";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { carrito, agregarAlCarrito, eliminarDelCarrito } = useCart();
  const { favoritos, agregarFavorito, eliminarFavorito } = useFavoritos();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingFav, setLoadingFav] = useState(false);
  const [addingCart, setAddingCart] = useState(false);
  const [colorSeleccionado, setColorSeleccionado] = useState("");
  const [talleSeleccionado, setTalleSeleccionado] = useState("");
  const [imagenActiva, setImagenActiva] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error("Error cargando producto");
        const data = await res.json();
        setProducto(data);
        setImagenActiva(data.imageUrl);
      } catch {
        toast.error("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    fetchProducto();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-16 text-gray-700 font-medium">
        Cargando producto…
      </div>
    );

  if (!producto)
    return (
      <div className="text-center py-16 text-gray-700 font-medium">
        Producto no encontrado
      </div>
    );

  const parseColores = (colores) => {
    if (!colores) return [];
    if (Array.isArray(colores)) return colores;
    return colores
      .replace(/\s+y\s+/g, ",")
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);
  };

  const parseTalles = (talles) => {
    if (!talles) return [];
    if (Array.isArray(talles)) return talles;
    return talles
      .replace(/Talles\s*\(|\)/gi, "")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
  };

  const coloresArray = parseColores(producto.colores);
  const tallesArray = parseTalles(producto.talles);

  const favoritosArray = Array.isArray(favoritos) ? favoritos : [];
  const isFavorito = favoritosArray.some(
    (f) => (f?.producto_id || f?.id)?.toString() === producto.id?.toString()
  );

  const toggleFavorito = async () => {
    if (!token) {
      toast.info("Iniciá sesión para agregar a favoritos");
      return;
    }
    if (loadingFav) return;
    setLoadingFav(true);
    try {
      isFavorito
        ? await eliminarFavorito(producto.id)
        : await agregarFavorito(producto);
    } catch {
      toast.error("No se pudo actualizar favoritos");
    } finally {
      setLoadingFav(false);
    }
  };

  const carritoArray = Array.isArray(carrito) ? carrito : [];
  const isInCart = carritoArray.some(
    (item) => (item.producto_id || item.id)?.toString() === producto.id?.toString()
  );

  const handleAgregarAlCarrito = async () => {
    if (!token) {
      toast.info("Iniciá sesión para poder comprar");
      return;
    }

    if (!colorSeleccionado && coloresArray.length > 0) {
      toast.info("Seleccioná un color");
      return;
    }

    if (!talleSeleccionado && tallesArray.length > 0) {
      toast.info("Seleccioná un talle");
      return;
    }

    if (addingCart || producto.estado !== "activo") return;

    try {
      setAddingCart(true);

      const productoParaCarrito = {
        ...producto,
        color: colorSeleccionado || null,
        talle: talleSeleccionado || null,
      };

      if (isInCart) {
        await eliminarDelCarrito(producto.id);
        toast.info("Producto eliminado del carrito");
      } else {
        await agregarAlCarrito(productoParaCarrito, 1);
        toast.success("Producto agregado al carrito");
      }
    } catch {
      toast.error("No se pudo actualizar el carrito");
    } finally {
      setAddingCart(false);
    }
  };

  const imgSrc = producto.imageUrl
    ? producto.imageUrl.startsWith("http")
      ? producto.imageUrl
      : `${CLOUDINARY_BASE_URL}${producto.imageUrl}`
    : "/placeholder.png";

  const imagenesProducto = [
    producto.imageUrl,
    ...(producto.imagenes || []),
  ].filter(Boolean);

  const productoInactivo = producto.estado !== "activo";

  return (
    <div className="bg-white px-3 py-6 md:px-20 md:py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg md:shadow-lg p-4 md:p-8 relative">

        <button
          onClick={toggleFavorito}
          className={`absolute top-3 right-3 text-2xl ${
            isFavorito
              ? "text-pink-200"
              : "text-gray-700 hover:text-pink-200"
          }`}
        >
          <FaHeart />
        </button>

        <h2 className="text-xl md:text-3xl font-medium text-gray-700 mb-4 text-center">
          {producto.nombre}
        </h2>

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

          <div className="flex flex-col items-center gap-3">
            <img
              src={imagenActiva || imgSrc}
              alt={producto.nombre}
              className="w-full max-w-[220px] md:max-w-xs h-56 md:h-80 object-contain rounded-lg"
            />

            {imagenesProducto.length > 1 && (
              <Swiper modules={[Navigation]} navigation spaceBetween={10} slidesPerView={4}>
                {imagenesProducto.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      onClick={() => setImagenActiva(img)}
                      className={`h-16 w-full object-contain border rounded cursor-pointer ${
                        imagenActiva === img ? "border-pink-200" : "border-gray-300"
                      }`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full text-center md:text-left text-gray-700 font-medium">

            {producto.descripcion && <p>{producto.descripcion}</p>}

            {/* ✅ COLOR CORREGIDO */}
            {coloresArray.length > 0 && (
              <div>
                <label className="font-medium">Elegí un color:</label>
                <select
                  value={colorSeleccionado}
                  onChange={(e) => setColorSeleccionado(e.target.value)}
                  className="border rounded px-2 py-1 mt-1"
                >
                  <option value="">Seleccionar</option>
                  {coloresArray.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {/* ✅ TALLE CORREGIDO */}
            {tallesArray.length > 0 && (
              <div>
                <label className="font-medium">Elegí un talle:</label>
                <select
                  value={talleSeleccionado}
                  onChange={(e) => setTalleSeleccionado(e.target.value)}
                  className="border rounded px-2 py-1 mt-1"
                >
                  <option value="">Seleccionar</option>
                  {tallesArray.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}

            <p className="text-2xl font-medium text-gray-700 mt-2">
              ${new Intl.NumberFormat("es-AR").format(producto.precio)}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <button
                onClick={handleAgregarAlCarrito}
                className="bg-pink-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-pink-300 transition flex items-center justify-center gap-2"
              >
                <FaShoppingBag />
                {isInCart ? "Quitar del carrito" : "Agregar al carrito"}
              </button>

              <button
                onClick={() => navigate("/")}
                className="bg-blue-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-blue-300 transition"
              >
                Seguir comprando
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;