import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Tienda.css';

const Carrito = ({ carrito, setCarrito }) => {
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const calcularTotal = () => {
      const total = carrito.reduce((acc, plato) => {
        const precio = plato.isPromotion ? parseFloat(plato.precioConDescuento) : plato.precio_Referencia;
        return acc + precio * plato.cantidad;
      }, 0);
      setTotal(total);
    };

    calcularTotal();
  }, [carrito]);

  const handleIncrement = (platoId) => {
    const nuevoCarrito = carrito.map(plato => {
      if (plato.iD_Plato === platoId) {
        return { ...plato, cantidad: plato.cantidad + 1 };
      }
      return plato;
    });
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const handleDecrement = (platoId) => {
    const nuevoCarrito = carrito.map(plato => {
      if (plato.iD_Plato === platoId) {
        if (plato.cantidad > 1) {
          return { ...plato, cantidad: plato.cantidad - 1 };
        } else {
          if (window.confirm('¿Deseas eliminar este plato del carrito?')) {
            return null;
          }
        }
      }
      return plato;
    }).filter(plato => plato !== null);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const handleCheckout = () => {
    navigate('/pagos', { state: { total, tipoPago: 'Tarjeta', descripcionPago: 'Compra en tienda', clienteId: 1 } });
  };

  return (
    <div className="carrito">
      <h1>Tu Carrito</h1>
      {carrito.length > 0 ? (
        <div className="carrito-items">
          {carrito.map(plato => (
            <div key={plato.iD_Plato} className="carrito-item">
              <img src={plato.imagenUrl} alt={plato.nombre_Plato} />
              <div className="carrito-item-details">
                <h3>{plato.nombre_Plato}</h3>
                <p>{plato.descripcion}</p>
                <p>Precio: {plato.isPromotion ? plato.precioConDescuento : plato.precio_Referencia} Bs</p>
                {plato.isPromotion && <p className="promocion-label">En promoción</p>}
                <div className="quantity-controls">
                  <button className="carrito-button" onClick={() => handleDecrement(plato.iD_Plato)}>-</button>
                  <span>{plato.cantidad}</span>
                  <button className="carrito-button" onClick={() => handleIncrement(plato.iD_Plato)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>
  Tu carrito está vacío. <Link to="/">¡Añade algunos platos!</Link>
</p>

      )}
      <div className="carrito-total">
        <h2>Total: {total} Bs</h2>
        {carrito.length > 0 && (
          <button className="checkout-button" onClick={handleCheckout}>Proceder al Pago</button>
        )}
      </div>
    </div>
  );
};

export default Carrito;
