import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFrontendSettings } from "../../context/FrontendSettingsContext";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  API_BASE_URL,
} from "../../config";

const AdminFrontend = () => {
  const { settings, updateSettings } = useFrontendSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (field, value) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) handleChange("bannerUrl", data.secure_url);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error subiendo la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleApplyChanges = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        bannerUrl: localSettings.bannerUrl || null,
        bannerBlur: Boolean(localSettings.bannerBlur),
        cintaTexto: localSettings.cintaTexto || "",
        cintaVisible: localSettings.cintaVisible ?? true,
        miniBanners: localSettings.miniBanners || [],
      };

      const res = await axios.put(
        `${API_BASE_URL}/frontend-settings`,
        payload
      );

      const updated = {
        bannerUrl: res.data.bannerUrl,
        bannerBlur: Boolean(res.data.bannerBlur),
        cintaTexto: res.data.cintaTexto || "",
        cintaVisible: res.data.cintaVisible ?? true,
        miniBanners: res.data.miniBanners || [],
      };

      updateSettings(updated);
      setLocalSettings(updated);

      setSuccessMessage("Cambios aplicados correctamente");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-xl">
      <h2 className="text-2xl font-semibold mb-6">
        Configuración del Frontend
      </h2>

      {/* Banner */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Subir banner
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleBannerUpload}
          className="w-full border rounded p-2"
        />

        {uploading && <p className="text-sm text-gray-500 mt-1">Subiendo…</p>}

        {localSettings.bannerUrl && (
          <div className="relative mt-4 h-48 w-full overflow-hidden rounded bg-black">
            {localSettings.bannerBlur && (
              <div
                className="absolute inset-0 bg-center bg-cover blur-2xl scale-110"
                style={{ backgroundImage: `url(${localSettings.bannerUrl})` }}
              />
            )}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <img
                src={localSettings.bannerUrl}
                alt="Preview banner"
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      {/* Blur */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(localSettings.bannerBlur)}
          onChange={(e) => handleChange("bannerBlur", e.target.checked)}
        />
        <span>Blur en los costados del banner</span>
      </div>

      {/* Texto cinta */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Texto de la cinta informativa
        </label>
        <input
          type="text"
          value={localSettings.cintaTexto || ""}
          onChange={(e) => handleChange("cintaTexto", e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Toggle cinta */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="checkbox"
          checked={localSettings.cintaVisible}
          onChange={(e) => handleChange("cintaVisible", e.target.checked)}
        />
        <span>Mostrar cinta informativa</span>
      </div>

      {/* Preview cinta */}
      {localSettings.cintaVisible && localSettings.cintaTexto && (
        <div className="mb-6 overflow-hidden bg-[#6f7f66]/85 text-black py-2 px-4 font-medium whitespace-nowrap backdrop-blur-sm">
          <div className="inline-block animate-marquee">
            {`${localSettings.cintaTexto} • `.repeat(8)}
          </div>
        </div>
      )}

      {/* 🔥 MINI BANNERS */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Mini Banners</h3>

        {localSettings.miniBanners?.map((banner, index) => (
          <div key={index} className="border p-3 rounded mb-3 flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

                const res = await fetch(
                  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                  { method: "POST", body: formData }
                );
                const data = await res.json();

                const updated = [...localSettings.miniBanners];
                updated[index].imagen = data.secure_url;

                setLocalSettings((prev) => ({
                  ...prev,
                  miniBanners: updated,
                }));
              }}
            />

            {banner.imagen && (
              <img src={banner.imagen} className="h-24 object-cover rounded" />
            )}

            <input
              type="text"
              placeholder="Texto"
              value={banner.texto || ""}
              onChange={(e) => {
                const updated = [...localSettings.miniBanners];
                updated[index].texto = e.target.value;
                setLocalSettings((prev) => ({ ...prev, miniBanners: updated }));
              }}
              className="border rounded p-2"
            />

            {/* Categoría */}
            <select
              value={banner.categoria || ""}
              onChange={(e) => {
                const updated = [...localSettings.miniBanners];
                updated[index].categoria = e.target.value;
                setLocalSettings((prev) => ({ ...prev, miniBanners: updated }));
              }}
              className="border rounded p-2"
            >
              <option value="">-- Categoría --</option>
              <option value="ropa-nene">Ropa de nene</option>
              <option value="ropa-nena">Ropa de nena</option>
              <option value="bebes">Bebés</option>
              <option value="accesorios">Accesorios</option>
            </select>

            {/* Subcategoría */}
            <input
              type="text"
              placeholder="Subcategoría"
              value={banner.subcategoria || ""}
              onChange={(e) => {
                const updated = [...localSettings.miniBanners];
                updated[index].subcategoria = e.target.value;
                setLocalSettings((prev) => ({ ...prev, miniBanners: updated }));
              }}
              className="border rounded p-2"
            />

            {/* Temporada */}
            <select
              value={banner.temporada || ""}
              onChange={(e) => {
                const updated = [...localSettings.miniBanners];
                updated[index].temporada = e.target.value;
                setLocalSettings((prev) => ({ ...prev, miniBanners: updated }));
              }}
              className="border rounded p-2"
            >
              <option value="">-- Temporada --</option>
              <option value="otoño-invierno">Otoño-Invierno</option>
              <option value="primavera-verano">Primavera-Verano</option>
              <option value="nueva">Nueva colección</option>
              <option value="ofertas">Oferta</option>
            </select>

            <button
              onClick={() => {
                const updated = localSettings.miniBanners.filter((_, i) => i !== index);
                setLocalSettings((prev) => ({ ...prev, miniBanners: updated }));
              }}
              className="text-red-500 text-sm"
            >
              Eliminar
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            setLocalSettings((prev) => ({
              ...prev,
              miniBanners: [
                ...(prev.miniBanners || []),
                { imagen: "", texto: "", categoria: "", subcategoria: "", temporada: "" },
              ],
            }))
          }
          className="bg-gray-200 px-3 py-1 rounded"
        >
          + Agregar banner
        </button>
      </div>

      {/* Feedback */}
      {successMessage && <p className="mb-4 text-pink-200 font-medium">{successMessage}</p>}
      {errorMessage && <p className="mb-4 text-blue-200 font-medium">{errorMessage}</p>}

      <button
        onClick={handleApplyChanges}
        disabled={saving}
        className="bg-pink-200 text-bg-grey-700 px-4 py-2 rounded hover:opacity-90"
      >
        {saving ? "Guardando…" : "Aplicar cambios"}
      </button>
    </div>
  );
};

export default AdminFrontend;