import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "../context/SearchContext";

export default function SearchBar() {
  const { query, setQuery, clearSearch } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      clearSearch();
      if (location.pathname !== "/") {
        navigate("/");
      }
      return;
    }

    if (location.pathname !== "/search") {
      navigate("/search");
    }
  };

  return (
    <input
      type="search"
      placeholder="Buscar productos..."
      value={query}
      onChange={handleChange}
      className="border border-gray-300 rounded px-3 py-1 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
    />
  );
}
