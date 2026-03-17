import React from "react";
import { useCart } from "./CartContext";

const numeroTienda = "+5491164283906"; // número de WhatsApp de la tienda

const BotonWhatsAppCheckout = () => {
  const { carrito, total } = useCart();

  if (!carrito || carrito.length === 0) return null; // ocultar si carrito vacío

  const generarMensaje = () => {
    const productosTexto = carrito
      .map((p) => {
        // agregamos talla/color si existen
        const extras = p.talle ? ` - Talle: ${p.talle}` : "";
        const color = p.color ? ` - Color: ${p.color}` : "";
        return `${p.nombre}${extras}${color} x${p.cantidad}`;
      })
      .join("\n");

    // mensaje final
    const mensaje = `Hola, quiero comprar los siguientes productos:\n${productosTexto}\nTotal estimado: $${total.toFixed(2)}\nLa disponibilidad final de stock, colores y talles se confirma por WhatsApp.`;

    return encodeURIComponent(mensaje);
  };

  const linkWhatsApp = `https://wa.me/${numeroTienda}?text=${generarMensaje()}`;

  return (
    <a
      href={linkWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-lila w-full mt-4 text-center py-3"
    >
      Finalizar compra por WhatsApp
    </a>
  );
};

export default BotonWhatsAppCheckout;
