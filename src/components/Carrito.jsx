import React, { useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import placeholderImg from "../assets/carrito-de-compras.png";
import { ShoppingBag } from "lucide-react";

const numeroTienda = "5491138175256";

const Carrito = () => {
  const { user } = useAuth();
  const {
    carrito,
    vaciarCarrito,
    eliminarDelCarrito,
    agregarAlCarrito,
    total,
    loading,
    syncingIds,
  } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const linkWhatsApp = useMemo(() => {
    if (!carrito.length) return "#";

    const productosTexto = carrito
      .map((p) => {
        const precioNum = Number(p.precio ?? p.price ?? 0);
        const subtotal = precioNum * p.cantidad;
        const color = p.color ?? p.selectedColor ?? "";
        const talle = p.talle ?? p.selectedTalle ?? p.size ?? "";
        const imagenLink = p.imageUrl ?? p.imagen ?? p.image ?? p.img ?? "";

        return `• ${p.nombre}

Color: ${color || "No especificado"}
Talle: ${talle || "No especificado"}
Precio unitario: $${precioNum.toLocaleString("es-AR")}
Cantidad: ${p.cantidad}
Subtotal: $${subtotal.toLocaleString("es-AR")}
${imagenLink ? `Ver producto: ${imagenLink}` : ""}`;
      })
      .join("\n\n");

    const mensaje = `Hola 😊  
Quiero consultar por la compra de los siguientes productos:

${productosTexto}

Total estimado: $${total.toLocaleString("es-AR")}

Quedo a la espera para confirmar stock y disponibilidad.`;

    return `https://wa.me/${numeroTienda}?text=${encodeURIComponent(mensaje)}`;
  }, [carrito, total]);

  if (!user) {
    return (
      <div className="min-h-screen pt-20 md:pt-24 pb-20 px-4 text-center bg-white">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Tu carrito
        </h1>

        <p className="text-gray-700 mb-6">
          Para agregar productos necesitás iniciar sesión.
        </p>

        <Link
          to="/auth"
          className="inline-block bg-pink-200 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-pink-300 transition active:scale-95 active:translate-y-1"
        >
          Iniciar sesión / Registrarse
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 px-4 bg-white">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
        Tu Carrito
      </h1>

      {loading ? (
        <div className="text-center text-gray-700">Cargando carrito...</div>
      ) : carrito.length === 0 ? (
        <div className="text-center text-gray-700">
          <p>No hay productos en el carrito.</p>
          <Link
            to="/"
            className="mt-4 inline-block text-gray-800 font-semibold px-4 py-2 rounded-lg transition active:scale-95 active:translate-y-1"
            style={{ backgroundColor: "#a3c4f3" }}
          >
            Seguir comprando
          </Link>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6 space-y-4">
          {carrito.map((producto) => {
            const precioNum = Number(producto.precio || 0);
            const subtotal = precioNum * producto.cantidad;

            const imgSrc =
              producto.imageUrl ||
              producto.imagen ||
              producto.image ||
              placeholderImg;

            const syncing = syncingIds.includes(producto.uniqueKey);

            const color =
              producto.color || producto.selectedColor || "";
            const talle =
              producto.talle || producto.selectedTalle || "";

            return (
              <div
                key={producto.uniqueKey}
                className="flex flex-col md:flex-row items-center md:justify-between border-b pb-4 gap-4"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img
                    src={imgSrc}
                    alt={producto.nombre}
                    className="w-20 h-20 object-contain rounded"
                    onError={(e) => {
                      e.currentTarget.src = placeholderImg;
                    }}
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">
                      {producto.nombre}
                    </h2>

                    {color && (
                      <p className="text-sm text-gray-600">
                        Color: {color}
                      </p>
                    )}

                    {talle && (
                      <p className="text-sm text-gray-600">
                        Talle: {talle}
                      </p>
                    )}

                    <p className="text-sm text-gray-600">
                      Precio unitario:{" "}
                      <span className="text-pink-200 font-semibold">
                        ${precioNum.toLocaleString("es-AR")}
                      </span>
                    </p>

                    <p className="text-blue-300 font-semibold">
                      Subtotal: ${subtotal.toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <button
                    onClick={() =>
                      producto.cantidad === 1
                        ? eliminarDelCarrito(producto.uniqueKey)
                        : agregarAlCarrito(producto, -1)
                    }
                    disabled={syncing}
                    className="px-3 py-1 border rounded disabled:opacity-50 transition active:scale-95 active:translate-y-1"
                  >
                    −
                  </button>

                  <span className="w-8 text-center font-semibold text-gray-800">
                    {producto.cantidad}
                  </span>

                  <button
                    onClick={() => agregarAlCarrito(producto, 1)}
                    disabled={syncing}
                    className="px-3 py-1 border rounded disabled:opacity-50 transition active:scale-95 active:translate-y-1"
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      eliminarDelCarrito(producto.uniqueKey)
                    }
                    disabled={syncing}
                    className="text-pink-200 hover:text-pink-400 transition text-lg"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="text-right text-xl font-semibold text-gray-800">
            Total: ${total.toLocaleString("es-AR")}
          </div>

          <div className="mt-4 flex justify-center">
            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 font-semibold px-4 py-2 rounded-lg shadow transition active:scale-95 active:translate-y-1 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#f3c4d3" }}
            >
              <ShoppingBag className="w-5 h-5" />
              Finalizar compra
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-between mt-4 gap-2">
            <button
              onClick={vaciarCarrito}
              disabled={syncingIds.length > 0}
              className="text-gray-800 font-semibold px-4 py-2 rounded-lg transition active:scale-95 active:translate-y-1"
              style={{ backgroundColor: "#a3c4f3" }}
            >
              Vaciar carrito
            </button>

            <Link
              to="/"
              className="text-gray-800 font-semibold px-4 py-2 rounded-lg transition active:scale-95 active:translate-y-1 text-center"
              style={{ backgroundColor: "#8fae9f" }}
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;