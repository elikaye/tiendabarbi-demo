import React from "react";
import { useFrontendSettings } from "../context/FrontendSettingsContext";

const MiniBanners = () => {
  const { settings } = useFrontendSettings();
  const { miniBanners = [] } = settings;

  if (!miniBanners.length) return null;

  return (
    <section className="py-8 bg-white">
      <div className="relative mb-6 flex justify-center">
        <h2 className="relative z-10 text-gray-700 text-2xl md:text-3xl font-semibold px-4">
          COLECCIONES 🍄‍🟫🐻
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-4 px-4">
        {miniBanners.map((banner, idx) => {
          const { categoria, subcategoria, temporada } = banner;

          let link = "/products";
          const query = new URLSearchParams();
          if (temporada) query.set("temporada", temporada);
          if (categoria) query.set("categoria", categoria);
          if (subcategoria) query.set("subcategoria", subcategoria);

          if ([...query].length) link += `?${query.toString()}`;

          return (
            <a
              key={idx}
              href={link}
              className="relative w-full md:w-[32%] h-64 md:h-80 overflow-hidden rounded-md cursor-pointer group block"
            >
              {/* Imagen del banner */}
              <img
                src={banner.imagen}
                alt={banner.texto}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Overlay con blur para el título */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded">
                  <span className="text-black/75 text-lg md:text-xl font-medium text-center">
                    {banner.texto}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default MiniBanners;