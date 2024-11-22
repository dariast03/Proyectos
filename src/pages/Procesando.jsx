import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Procesando.css';

const Procesando = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, tipoPago, descripcionPago, clienteId } = location.state;
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const procesarPago = async () => {
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        const pagoResponse = await fetch('https://sj3qgblc-7263.brs.devtunnels.ms/api/Pagos/Insertar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            iD_Pago: 0,
            nombre_Entidad: tipoPago,
            comisiones: 5,
            descripcion_Pago: descripcionPago,
            iD_Cliente: clienteId,
          }),
        });

        const pagoData = await pagoResponse.json();
        const pagoId = pagoData.iD_Pago;

        const pedidoResponse = await fetch('https://sj3qgblc-7263.brs.devtunnels.ms/api/Pedidos/Insertar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            iD_Pedido: 0,
            fecha_Pedido: new Date().toISOString().split('T')[0],
            estado_Pedido: 'Preparando',
            total_Pedido: total,
            iD_Pago: pagoId,
            iD_Cliente: clienteId,
          }),
        });

        const pedidoData = await pedidoResponse.json();
        const pedidoId = pedidoData.iD_Pedido;

        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        for (const plato of carrito) {
          const precio = plato.isPromotion ? parseFloat(plato.precioConDescuento) : plato.precio_Referencia;
          const subtotal = precio * plato.cantidad;
          await fetch('https://sj3qgblc-7263.brs.devtunnels.ms/api/PedidoClientes/Insertar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              iD_Detalle_Pedido: 0,
              precio_Unitario: precio,
              subtotal: subtotal,
              iD_Pedido: pedidoId,
              iD_Pago: pagoId,
              iD_Cliente: clienteId,
              iD_Plato: plato.iD_Plato,
            }),
          });
        }

        localStorage.removeItem('carrito');
        setTimeout(() => {
          navigate('/Exitoso');
        }, 3000);
      } catch (error) {
        console.error('Error al procesar el pago:', error);
      }
    };

    procesarPago();
  }, [isProcessing, navigate, total, tipoPago, descripcionPago, clienteId]);

  return (
    <div
      className="Procesando"
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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "#fff",
        fontSize: "2em",
        fontWeight: "bold",
        zIndex: 1000
      }}
    >
      <div
        className="spinner"
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #fff",
          borderTop: "5px solid transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}
      ></div>
      <p>Procesando pago...</p>
    </div>
  );

};

export default Procesando;
