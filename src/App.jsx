// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FavoritosProvider } from "./context/FavoritosContext";
import { FrontendSettingsProvider } from "./context/FrontendSettingsContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Destacados from "./components/Destacados";
import ProductosList from "./components/ProductosList";
import MiniBanners from "./components/MiniBanners";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";

import AdminDashboard from "./components/admin/AdminDashboard";
import Auth from "./components/admin/Auth";
import Register from "./components/admin/Register";

import DetalleProducto from "./components/DetalleProducto";
import Carrito from "./components/Carrito";
import FavoritosPage from "./pages/FavoritosPage";
import SearchResults from "./pages/SearchResults";

import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

/* 🔥 NUEVAS PÁGINAS */
import RopaNena from "./pages/RopaNena";
import RopaNene from "./pages/RopaNene";
import Bebes from "./pages/Bebes";
import Accesorios from "./pages/Accesorios";

/* ===============================
   🔐 Ruta protegida Admin
================================ */
const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.rol === "admin" ? children : <Navigate to="/auth" />;
};

/* ===============================
   📦 Contenido principal
================================ */
const AppContent = () => {
  return (
    <>
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24">
        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <MiniBanners />
                <ProductosList start={0} limit={8} />
                <Destacados />
                <ProductosList start={8} limit={8} />
              </>
            }
          />

          {/* BUSCADOR */}
          <Route path="/search" element={<SearchResults />} />

          {/* SECCIONES */}
          <Route path="/ropa-nena" element={<RopaNena />} />
          <Route path="/ropa-nene" element={<RopaNene />} />
          <Route path="/bebes" element={<Bebes />} />
          <Route path="/accesorios" element={<Accesorios />} />

          {/* 🔥 LISTADO GENERAL DE PRODUCTOS */}
          <Route path="/products" element={<ProductosList />} />

          {/* DETALLE DE PRODUCTO */}
          <Route path="/producto/:id" element={<DetalleProducto />} />

          {/* CARRITO */}
          <Route path="/carrito" element={<Carrito />} />

          {/* FAVORITOS */}
          <Route path="/favoritos" element={<FavoritosPage />} />

          {/* AUTH */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/register" element={<Register />} />

          {/* PASSWORD */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* REDIRECCIÓN */}
          <Route path="/ropa" element={<Navigate to="/ropa-nena" />} />

        </Routes>
      </main>
    </>
  );
};

/* ===============================
   🚀 App principal
================================ */
function App() {
  return (
    <AuthProvider>
      <FrontendSettingsProvider>
        <CartProvider>
          <SearchProvider>
            <FavoritosProvider>
              <Router>

                <ScrollToTop />

                <div className="font-sans text-gray-700 flex flex-col min-h-screen bg-white">

                  <AppContent />

                  <footer className="mt-auto">
                    <Footer />
                  </footer>

                  <WhatsAppButton />

                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    draggable
                    closeButton={false}
                    toastClassName={({ type }) => {
                      switch (type) {
                        case "success":
                          return "bg-pink-200 text-gray-700 font-medium px-4 py-2 rounded shadow-lg";
                        case "info":
                          return "bg-blue-200 text-gray-700 font-medium px-4 py-2 rounded shadow-lg";
                        case "error":
                          return "bg-pink-200 text-gray-700 font-medium px-4 py-2 rounded shadow-lg";
                        default:
                          return "bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded shadow-lg";
                      }
                    }}
                    bodyClassName="flex items-center"
                  />

                </div>

              </Router>
            </FavoritosProvider>
          </SearchProvider>
        </CartProvider>
      </FrontendSettingsProvider>
    </AuthProvider>
  );
}

export default App;