import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearch } from "../context/SearchContext";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const { setQuery } = useSearch();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 👇 si vuelvo al home, limpio búsqueda
    if (pathname === "/") {
      setQuery("");
    }
  }, [pathname]);

  return null;
}
