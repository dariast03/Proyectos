import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Exitoso.css';

const Exitoso = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem('carrito');
      navigate('/');
      window.location.reload(); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="Exitoso"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        color: "green",
        fontSize: "2em",
        fontWeight: "bold",
        textAlign: "center",
        zIndex: 1000
      }}
    >
      <h1 style={{ fontSize: "2.5em" }}>Pago realizado con éxito</h1>
      <p style={{ fontSize: "1.5em" }}>Gracias por tu compra.</p>
      <div className="smiley" style={{ fontSize: "3em", marginTop: "10px" }}>😊</div>
    </div>
  );
  
};

export default Exitoso;
