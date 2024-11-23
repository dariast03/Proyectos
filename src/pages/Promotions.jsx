import React, { useEffect, useState } from 'react';
import './Promotions.css';

const Promotions = ({ handleAddToCart }) => {
  const [platos, setPlatos] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    const clienteId = localStorage.getItem('clienteId');
    setIsLoggedIn(!!usuarioId && !!clienteId);

    const fetchPlatos = async () => {
      try {
        const response = await fetch('https://51r87rnm-7263.brs.devtunnels.ms/api/Platos/Listar');
        const data = await response.json();
        setPlatos(data);
      } catch (error) {
        console.error('Error al cargar los platos:', error);
      }
    };

    const fetchPromociones = async () => {
      try {
        const response = await fetch('https://51r87rnm-7263.brs.devtunnels.ms/api/Promociones/Listar');
        const data = await response.json();
        setPromociones(data.filter(promo => promo.descripcion_Promocion !== "null"));
      } catch (error) {
        console.error('Error al cargar las promociones:', error);
      }
    };

    fetchPlatos();
    fetchPromociones();
  }, []);

  const calculateTimeLeft = (endDate) => {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const getDiscountedPrice = (price, discount) => {
    return (price - (price * discount / 100)).toFixed(2);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPriceRange([0, e.target.value]);
  };

  const togglePriceFilter = () => {
    setShowPriceFilter(!showPriceFilter);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filteredPromociones = promociones.filter(promo => {
    const platosEnPromocion = platos.filter(plato => plato.iD_Promocion === promo.iD_Promocion);
    return platosEnPromocion.some(plato =>
      plato.nombre_Plato.toLowerCase().includes(searchTerm.toLowerCase()) &&
      plato.precio_Referencia >= priceRange[0] &&
      plato.precio_Referencia <= priceRange[1]
    );
  });

  const sortedPromociones = filteredPromociones.sort((a, b) => {
    if (sortOption === 'fecha') {
      return new Date(a.fecha_Fin) - new Date(b.fecha_Fin);
    } else if (sortOption === 'descuento') {
      return b.descuento - a.descuento;
    }
    return 0;
  });

  return (
    <div className="promotions-page">
      <section className="banner">
        <h1>Promociones Especiales</h1>
        <p>¡Aprovecha nuestras ofertas antes de que se acaben!</p>
      </section>

      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre de plato..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
          <button className="filter-button" onClick={togglePriceFilter}>⚙️ Filtro de precios</button>
        </div>
        {showPriceFilter && (
          <div className="price-filter">
            <label>Rango de precios: 0 - {priceRange[1]} Bs</label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="price-range"
            />
          </div>
        )}
        <div className="sort-options">
          <label>Ordenar por:</label>
          <select value={sortOption} onChange={handleSortChange}>
            <option value="">Seleccionar</option>
            <option value="fecha">Próximas a terminar</option>
            <option value="descuento">Mayor % de descuento</option>
          </select>
        </div>
      </section>

      <div className="promotions">
        {sortedPromociones.map((promo) => {
          const platosEnPromocion = platos.filter(plato => plato.iD_Promocion === promo.iD_Promocion);
          if (platosEnPromocion.length === 0) return null;

          const timeLeft = calculateTimeLeft(promo.fecha_Fin);
          return (
            <div key={promo.iD_Promocion} className="promo-card">
              <h2>{promo.descripcion_Promocion}</h2>
              <p>Descuento: {promo.descuento}%</p>
              <p className="time-left">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s restantes
              </p>
              <div className="promo-dishes">
                {platosEnPromocion.map((plato) => (
                  <div key={plato.iD_Plato} className="dish">
                    <img src={plato.imagenUrl} alt={plato.nombre_Plato} />
                    <h3>{plato.nombre_Plato}</h3>
                    <p>{plato.descripcion}</p>
                    <p>Precio Original: {plato.precio_Referencia} Bs</p>
                    <p>Precio con Descuento: {getDiscountedPrice(plato.precio_Referencia, promo.descuento)} Bs</p>
                    {isLoggedIn && (
                      <button onClick={() => handleAddToCart({
                        ...plato,
                        isPromotion: true,
                        precioConDescuento: getDiscountedPrice(plato.precio_Referencia, promo.descuento)
                      })}>Añadir al carrito</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Promotions;
