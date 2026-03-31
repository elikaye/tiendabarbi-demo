import React from "react";
import { useFrontendSettings } from "../context/FrontendSettingsContext";

export default function Hero() {
  const { settings } = useFrontendSettings();
  const { bannerUrl, bannerBlur, cintaTexto, cintaVisible } = settings;

  return (
    <section className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] overflow-hidden bg-[var(--bg)] overflow-x-hidden">

      {/* BANNER */}
      {bannerUrl && (
        <img
          src={bannerUrl}
          alt="Banner"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover animate-fadeUp"
        />
      )}

      {/* OVERLAY (para que la imagen no se vea lavada) */}
      <div className="absolute inset-0 bg-[var(--beige)]/40 z-10" />

      {/* BLUR COSTADOS */}
      {bannerBlur && bannerUrl && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-[var(--bg)]/40 backdrop-blur-md z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-[var(--bg)]/40 backdrop-blur-md z-20" />
        </>
      )}
   

    </section>
  );
}