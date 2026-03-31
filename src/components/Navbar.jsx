// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { LayoutDashboard, Heart, Search, ShoppingBag, LogOut } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { useFavoritos } from "../context/FavoritosContext";
import { useAuth } from "../context/AuthContext";
import { useFrontendSettings } from "../context/FrontendSettingsContext";

function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(null);
  const [hideTopBar, setHideTopBar] = useState(false);

  const { carrito } = useCart();
  const { favoritos } = useFavoritos();
  const { setQuery } = useSearch();
  const { user, logout } = useAuth();

  const { settings } = useFrontendSettings();
  const { cintaTexto, cintaVisible } = settings;

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setHideTopBar(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const secciones = [
    ["Inicio", "/"],
    ["Ropa de nena", "/ropa-nena"],
    ["Ropa de nene", "/ropa-nene"],
    ["Bebés", "/bebes"],
    ["Accesorios", "/accesorios"],
  ];

  const subcategorias = {
    "/ropa-nena": ["Remeras y Camisetas", "Pantalones", "Camperas y buzos", "Shorts y polleras", "Conjuntos", "Vestidos", "otros"],
    "/ropa-nene": ["Remeras y Camisetas", "Pantalones", "Camperas y buzos", "Shorts y Bermudas", "Conjuntos", "otros"],
    "/bebes": ["Bodys", "Enteritos", "Conjuntos", "Abrigos", "Otros"],
    "/accesorios": ["Gorros", "Medias", "Baberos", "Binchas y Colitas", "Otros"],
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = localQuery.trim();
    setQuery(q);
    setShowSearch(false);
    if (!q) navigate("/");
    else navigate("/search");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">

      {/* 🔔 CINTA */}
      {cintaVisible && cintaTexto && (
        <div
          className={`
            w-full text-white text-sm overflow-hidden
            bg-primary
            transition-all duration-300
            ${hideTopBar ? "max-h-0 py-0 opacity-0" : "max-h-20 py-2 opacity-100"}
          `}
        >
          <div className="flex w-max animate-marquee">
            <span className="px-20 whitespace-pre">{cintaTexto}</span>
            <span className="px-20 whitespace-pre">{cintaTexto}</span>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <div className="bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

          {/* 🍔 */}
          <button
            className="md:hidden text-xl text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* DESKTOP */}
          <nav className="hidden md:flex gap-10 font-medium text-lg text-gray-700">
            {secciones.map(([label, to]) => (
              <div key={to} className="relative group">

                <NavLink to={to}>{label}</NavLink>

                {/* MEGA MENU */}
                {subcategorias[to] && (
                  <div className="absolute left-0 top-full mt-2 bg-white/80 backdrop-blur-md shadow-lg rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

                    <div className="flex">

                      <div className="p-6 min-w-[220px] flex flex-col gap-3">
                        {subcategorias[to].map((sub) => (
                          <Link
                            key={sub}
                            to={`${to}?subcategoria=${encodeURIComponent(sub)}`}
                            className="text-sm hover:text-primary"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>

                      <div className="hidden md:flex items-center justify-center p-4 w-[160px]">
                        <img
                          src="/tienda_infantil.png"
                          alt="logo"
                          className="w-[100px] h-[100px] object-contain opacity-80"
                        />
                      </div>

                    </div>
                  </div>
                )}

              </div>
            ))}
          </nav>

          {/* ICONOS */}
          <div className="flex items-center gap-4 relative text-gray-700">

            {/* 🔍 LUPA (intacta) */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                className="cursor-pointer hover:text-primary"
                onClick={() => setShowSearch(!showSearch)}
              />

              {showSearch && (
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[90%] max-w-sm px-4 py-2 bg-white border border-gray-300 rounded shadow z-[999]"
                />
              )}
            </form>

            <NavLink to="/favoritos" className="relative">
              <Heart className="hover:text-primary" />
              {favoritos.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-200 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {favoritos.length}
                </span>
              )}
            </NavLink>

            <NavLink to="/carrito" className="relative">
              <ShoppingBag className="hover:text-primary" />
              {carrito.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-200 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {carrito.length}
                </span>
              )}
            </NavLink>

            {user?.rol === "admin" && (
              <button onClick={() => navigate("/admin")}>
                <LayoutDashboard className="hover:text-primary" />
              </button>
            )}

            {/* 🔥 LOGOUT ICONO */}
            {user ? (
              <button onClick={logout} className="hover:text-primary">
                <LogOut size={20} />
              </button>
            ) : (
              <Link to="/auth">
                <FaUserCircle className="hover:text-primary" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 py-4 shadow-md flex flex-col gap-3 relative">

          <img
            src="/tienda_infantil.png"
            alt="logo"
            className="absolute right-4 top-4 w-12 h-12 object-contain opacity-70"
          />

          {secciones.map(([label, to]) => (
            <div key={to} className="flex flex-col">

              {/* 🔥 FIX NAVLINK */}
              <NavLink
                to={to}
                onClick={() => {
                  if (subcategorias[to]) {
                    setMobileOpen(mobileOpen === to ? null : to);
                  } else {
                    navigate(to);
                    setMenuOpen(false);
                  }
                }}
                className={({ isActive }) =>
                  `flex justify-between items-center cursor-pointer text-lg
                  ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-gray-700 hover:text-primary"
                  }`
                }
              >
                <span>{label}</span>
                {subcategorias[to] && (
                  <span>{mobileOpen === to ? "−" : "+"}</span>
                )}
              </NavLink>

              {subcategorias[to] && mobileOpen === to && (
                <div className="pl-4 mt-2 flex flex-col gap-2">
                  {subcategorias[to].map((sub) => (
                    <NavLink
                      key={sub}
                      to={`${to}?subcategoria=${encodeURIComponent(sub)}`}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `text-sm ${
                          isActive
                            ? "text-primary font-semibold"
                            : "text-gray-700 hover:text-primary"
                        }`
                      }
                    >
                      {sub}
                    </NavLink>
                  ))}
                </div>
              )}

            </div>
          ))}

          {/* LOGOUT MOBILE */}
          {user && (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="mt-3 flex items-center gap-2 text-grey-700 hover:text-primary"
            >
              <LogOut size={20} />
              <span className="text-sm">Salir</span>
            </button>
          )}

        </div>
      )}
    </header>
  );
}

export default Navbar;