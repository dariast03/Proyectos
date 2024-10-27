import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PagoExitoso.css';

const PagoExitoso = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem('carrito');
      navigate('/');
      window.location.reload(); // Recargar la página
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="pago-exitoso">
      <h1>Pago realizado con éxito</h1>
      <p>Gracias por tu compra.</p>
    </div>
  );
};

export default PagoExitoso;
