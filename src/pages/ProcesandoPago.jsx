import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProcesandoPago.css';

const ProcesandoPago = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { total, tipoPago, descripcionPago, clienteId } = location.state;

  useEffect(() => {
    const procesarPago = async () => {
      try {
        // Insertar Pago
        const pagoResponse = await fetch('https://localhost:7263/api/Pagos/Insertar', {
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

        // Insertar Pedido
        const pedidoResponse = await fetch('https://localhost:7263/api/Pedidos/Insertar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            iD_Pedido: 0,
            fecha_Pedido: new Date().toISOString().split('T')[0],
            estado_Pedido: 'Preparando', // Cambiado a "Preparando"
            total_Pedido: total,
            iD_Pago: pagoId,
            iD_Cliente: clienteId,
          }),
        });

        const pedidoData = await pedidoResponse.json();
        const pedidoId = pedidoData.iD_Pedido;

        // Insertar PedidoClientes
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        for (const plato of carrito) {
          const subtotal = plato.precio_Referencia * plato.cantidad;
          await fetch('https://localhost:7263/api/PedidoClientes/Insertar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              iD_Detalle_Pedido: 0,
              precio_Unitario: plato.precio_Referencia,
              subtotal: subtotal,
              iD_Pedido: pedidoId,
              iD_Pago: pagoId,
              iD_Cliente: clienteId,
              iD_Plato: plato.iD_Plato,
            }),
          });
        }

        // Limpiar el carrito y redirigir a la página de éxito
        localStorage.removeItem('carrito');
        setTimeout(() => {
          navigate('/pago-exitoso');
        }, 3000);
      } catch (error) {
        console.error('Error al procesar el pago:', error);
      }
    };

    procesarPago();
  }, [navigate, total, tipoPago, descripcionPago, clienteId]);

  return (
    <div className="procesando-pago">
      <div className="spinner"></div>
      <p>Procesando pago...</p>
    </div>
  );
};

export default ProcesandoPago;
