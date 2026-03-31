import React from 'react';
import logo from '../assets/tiendainfantil(1).png';
import mercadopago from '../assets/mercado-pago.svg';
import facebook from '../assets/facebook-white.png';
import instagram from '../assets/instagram-white.png';
import whatsapp from '../assets/whatsapp-white.png';

export default function Footer() {
  return (
    <footer className="bg-[#6f7f66] text-gray-100 py-12 px-6 font-medium">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 items-start text-sm">

        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <img src={logo} alt="Logo tienda" className="h-20 md:h-28" />
        </div>

        {/* Redes */}
        <nav
          aria-label="Redes Sociales"
          className="flex flex-col items-center md:items-start gap-3"
        >
          <p className="font-medium text-gray-200 text-base md:text-lg">
            Seguinos
          </p>

          <div className="flex gap-4">
            {[
              { href: "https://wa.me/+5491138175256", alt: "WhatsApp", src: whatsapp, color: "#a3b09d" }, // verde grisáceo
              { href: "https://www.instagram.com/NOMBRE/", alt: "Instagram", src: instagram, color: "#f7c8d2" }, // rosa bebé
              { href: "https://www.facebook.com/NOMBRE", alt: "Facebook", src: facebook, color: "#b8cfe0" }, // celeste apagado
            ].map(({ href, alt, src, color }) => (
              <a
                key={alt}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={alt}
              >
                <img
                  src={src}
                  alt={alt}
                  className="w-6 h-6"
                  style={{ filter: `grayscale(0%) drop-shadow(0 0 0 ${color})`, 
                           WebkitFilter: `grayscale(0%) drop-shadow(0 0 0 ${color})` }}
                />
              </a>
            ))}
          </div>
        </nav>

        {/* Contacto */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
    <p className="font-medium text-gray-200 text-base md:text-lg">
            Contacto
          </p>

          <a
            href="mailto:elianakaye13@gmail.com"
            className="hover:text-[#f7c8d2] hover:underline transition"
          >
            elianakaye13@gmail.com
          </a>

          <a
            href="https://wa.me/+5491138175256"
            className="hover:text-[#f7c8d2] hover:underline transition"
          >
            +54 9 11 3817-5256
          </a>
        </div>

        {/* Formas de pago */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="font-medium text-gray-200 text-base md:text-lg">
            Formas de pago
          </p>
          <span>Transferencia / Mercado Pago</span>
          <img src={mercadopago} alt="Mercado Pago" className="h-10" />
        </div>
      </div>

      {/* Copyright + Firma */}
      <div className="mt-10 text-center text-xs text-gray-300">
        <p>
          © {new Date().getFullYear()} Tienda Infantil. Todos los derechos reservados.
        </p>

        {/* FIRMA ROSA BEBÉ CON SHIMMER */}
        <p
          className="
            mt-4
            font-body font-extralight tracking-widest
            text-base sm:text-xl
            bg-clip-text text-transparent
          "
          style={{
            backgroundImage: 'linear-gradient(90deg, #f7c8d2 0%, #f7c8d2 100%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 4s infinite linear',
            filter: 'drop-shadow(0 0 4px rgba(247,200,210,0.5))',
          }}
        >
          Diseñado por <span>&lt;/CodeMoon🌙&gt;</span>
        </p>
      </div>
    </footer>
  );
}