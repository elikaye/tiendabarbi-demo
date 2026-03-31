import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from "../config";
import 'swiper/css';

function Destacados({ titulo = "Destacados" }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/products?destacados=true&limit=6`
        );
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const data = await response.json();
        setProductos(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error('❌ Error al cargar productos:', err);
        setError('No pudimos cargar los productos destacados.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
    return () => setProductos([]);
  }, []);

  const renderSkeletons = () =>
    Array(3)
      .fill(0)
      .map((_, i) => (
        <SwiperSlide key={`skeleton-${i}`}>
          <div className="h-[320px] sm:h-[420px] bg-gray-200 animate-pulse rounded-xl"></div>
        </SwiperSlide>
      ));

  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;
  if (!loading && !productos.length)
    return <p className="text-center py-10">No hay productos destacados disponibles.</p>;

  return (
    <section className="bg-[#f9f9f9] py-16">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-center gap-2 mb-10">

      <span className="text-xl">🐻</span>

      <h2 className="text-2xl md:text-3xl font-medium text-[#3a3a3a] tracking-wide">
       {titulo}
       </h2>

      </div>

        <Swiper
          modules={[Autoplay]}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={productos.length > 1}
          spaceBetween={16}
          slidesPerView={1.1}
          breakpoints={{
            640: { slidesPerView: 1.3 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2.5 },
          }}
        >
          {loading
            ? renderSkeletons()
            : productos.map((prod, idx) => {
                const isActive = idx === activeIndex;

                return (
                  <SwiperSlide key={prod.id}>
                    <Link to={`/producto/${prod.id}`}>
                      <div
                        className={`
                          relative overflow-hidden rounded-xl
                          h-[320px] sm:h-[420px]
                          cursor-pointer group transition-all duration-500
                          ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-70'}
                        `}
                      >
                        {/* IMAGEN */}
                        <img
                          src={prod.imageUrl || '/placeholder.png'}
                          alt={prod.nombre}
                          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                          loading="lazy"
                          onError={(e) => (e.currentTarget.src = '/placeholder.png')}
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
        </Swiper>

      </div>
    </section>
  );
}

export default Destacados;