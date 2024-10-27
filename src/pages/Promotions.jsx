import React, { useEffect, useState } from 'react';
import './Promotions.css';

const Promotions = ({ handleAddToCart }) => {
  const [platos, setPlatos] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    const clienteId = localStorage.getItem('clienteId');
    setIsLoggedIn(!!usuarioId && !!clienteId);

    const fetchPlatos = async () => {
      try {
        const response = await fetch('https://localhost:7263/api/Platos/Listar');
        const data = await response.json();
        setPlatos(data);
      } catch (error) {
        console.error('Error al cargar los platos:', error);
      }
    };

    const fetchPromociones = async () => {
      try {
        const response = await fetch('https://localhost:7263/api/Promociones/Listar');
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

  return (
    <div className="promotions-page">
      <section className="banner">
        <h1>Promociones Especiales</h1>
        <p>¡Aprovecha nuestras ofertas antes de que se acaben!</p>
      </section>

      <div className="promotions">
        {promociones.map((promo) => {
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
                      <button onClick={() => handleAddToCart(plato, true)}>Añadir al carrito</button>
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
