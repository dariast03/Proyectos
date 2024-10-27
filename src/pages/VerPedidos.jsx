import React, { useEffect, useState } from 'react';
import './VerPedidos.css';

const VerPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const clienteId = localStorage.getItem('clienteId');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Paso 1: Listar Pagos y filtrar por clienteId
        const pagosResponse = await fetch('https://localhost:7263/api/Pagos/Listar');
        const pagosData = await pagosResponse.json();
        const pagosCliente = pagosData.filter(pago => pago.iD_Cliente === parseInt(clienteId, 10));
        const pagosIds = pagosCliente.map(pago => pago.iD_Pago);

        // Guardar IDs de pagos en localStorage
        localStorage.setItem('pagosIds', JSON.stringify(pagosIds));

        // Paso 2: Listar Pedidos y filtrar por IDs de pagos
        const pedidosResponse = await fetch('https://localhost:7263/api/Pedidos/Listar');
        const pedidosData = await pedidosResponse.json();
        const pedidosCliente = pedidosData.filter(pedido => pagosIds.includes(pedido.iD_Pago));
        const pedidosIds = pedidosCliente.map(pedido => pedido.iD_Pedido);

        // Guardar IDs de pedidos en localStorage
        localStorage.setItem('pedidosIds', JSON.stringify(pedidosIds));

        // Paso 3: Listar PedidoClientes y filtrar por IDs de pedidos
        const pedidoClientesResponse = await fetch('https://localhost:7263/api/PedidoClientes/Listar');
        const pedidoClientesData = await pedidoClientesResponse.json();
        const pedidoClientesCliente = pedidoClientesData.filter(pedidoCliente => pedidosIds.includes(pedidoCliente.iD_Pedido));

        // Asociar el estado del pedido con los detalles del pedido
        const pedidosConEstado = pedidoClientesCliente.map(pedidoCliente => {
          const pedido = pedidosCliente.find(p => p.iD_Pedido === pedidoCliente.iD_Pedido);
          return {
            ...pedidoCliente,
            estado_Pedido: pedido ? pedido.estado_Pedido : 'Desconocido',
          };
        });

        setPedidos(pedidosConEstado);
      } catch (error) {
        console.error('Error al cargar los pedidos:', error);
      }
    };

    fetchPedidos();
  }, [clienteId]);

  return (
    <div className="ver-pedidos">
      <h1>Mis Pedidos</h1>
      {pedidos.length > 0 ? (
        <ul className="pedidos-list">
          {pedidos.map(pedido => (
            <li key={pedido.iD_Detalle_Pedido} className="pedido-item">
              <h3>Numero de Pedido: {pedido.iD_Pedido}</h3>
              <p>Precio Unitario: {pedido.precio_Unitario} Bs</p>
              <p>Subtotal: {pedido.subtotal} Bs</p>
              <p>Estado: {pedido.estado_Pedido}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes pedidos.</p>
      )}
    </div>
  );
};

export default VerPedidos;
