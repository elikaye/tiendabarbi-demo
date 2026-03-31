import React, { useEffect, useState, useRef } from "react";
import ProductoCard from "../components/ProductoCard";
import { API_BASE_URL, CLOUDINARY_BASE_URL } from "../config";
import { useLocation } from "react-router-dom";

let io = null;
try { io = require("socket.io-client"); } catch(e){ io = null; }

function normalizarSubcategoria(subRaw){
  if(!subRaw) return "Otros";
  const sub = subRaw.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  if(sub.includes("gorros")) return "gorros";
  if(sub.includes("medias")) return "medias";
  if(sub.includes("baberos")) return "baberos";
    if(sub.includes("bincha") || sub.includes("colita")) return "binchas y colitas";
  return "Otros";
}

const chunkArray = (arr, chunkSize) => {
  const result=[];
  for(let i=0;i<arr.length;i+=chunkSize){
    result.push(arr.slice(i,i+chunkSize));
  }
  return result;
};

export default function Accesorios(){
  const [productos,setProductos] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  const rawRef = useRef([]);
  const socketRef = useRef(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const subcategoriaQuery = queryParams.get("subcategoria")?.toLowerCase();
  const tituloSubcategoria = queryParams.get("subcategoria");

  const mezclarBalanceado = (lista)=>{
    const grupos={};
    lista.forEach(p=>{
      const key = normalizarSubcategoria(p.subcategoria);
      if(!grupos[key]) grupos[key]=[];
      grupos[key].push(p);
    });
    const resultado=[];
    let restos=true;
    const categorias=Object.keys(grupos);
    while(restos){
      restos=false;
      const orden=[...categorias].sort(()=>Math.random()-0.5);
      for(const cat of orden){
        if(grupos[cat].length>0){
          resultado.push(grupos[cat].shift());
          restos=true;
        }
      }
    }
    return resultado;
  };

  const fetchProductos = async()=>{
    setLoading(true);
    try{
      const res = await fetch(`${API_BASE_URL}/products`);
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const prods = (data.products || []).map(p=>({
        ...p,
        id:p.id||p._id,
        categoria: p.categoria?.toLowerCase() === "accesorios" ? "accesorios" : "otros",
        subcategoria: normalizarSubcategoria(p.subcategoria),
        precio: parseFloat(p.precio)||0,
        imageUrl: p.imageUrl && !p.imageUrl.startsWith("http")
          ? `${CLOUDINARY_BASE_URL}${p.imageUrl}` : p.imageUrl
      }));

      rawRef.current = prods.filter(p=>{
        if(p.categoria !== "accesorios") return false;
        if(subcategoriaQuery && p.subcategoria.toLowerCase() !== subcategoriaQuery) return false;
        return true;
      });

      setProductos(mezclarBalanceado(rawRef.current));
      setError(null);
    }catch(err){
      console.error(err);
      setError("No se pudieron cargar los productos de accesorios.");
      setProductos([]);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchProductos();
    let socketClient=null;
    try{
      if(io){
        socketClient=io.connect(window.location.origin);
        socketRef.current=socketClient;
        socketClient.on("productos:changed",fetchProductos);
      }
    }catch{}
    return ()=>{ if(socketRef.current) socketRef.current.disconnect(); };
  },[subcategoriaQuery]);

  const COLUMNAS_MOBILE = 4;

  return (
    <section className="min-h-screen py-20 px-6 bg-gradient-to-br from-white font-medium">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {tituloSubcategoria ? tituloSubcategoria : "Accesorios"}
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array(COLUMNAS_MOBILE*2).fill(0).map((_,i)=>
              <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
            )}
          </div>
        ) : error ? (
          <p className="text-center text-red-600 py-10">{error}</p>
        ) : productos.length>0 ? (
          <>
            <div className="sm:hidden space-y-4">
              {chunkArray(productos, COLUMNAS_MOBILE).map((filaProductos,index)=>(
                <div key={index} className="flex space-x-4 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
                  {filaProductos.map(p=>(
                    <div key={p.id} className="flex-shrink-0 w-64" style={{ scrollSnapAlign: "start" }}>
                      <ProductoCard producto={p}/>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {productos.map(p=> <ProductoCard key={p.id} producto={p}/>)}
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center">
            No hay productos disponibles en esta sección por el momento.
          </p>
        )}
      </div>
    </section>
  );
}