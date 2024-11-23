import React, { useEffect, useState } from 'react';
import './Listar.css';

const Listar = () => {
  const [pedidos, setPedidos] = useState([]);
  const clienteId = localStorage.getItem('clienteId');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const pagosResponse = await fetch('https://51r87rnm-7263.brs.devtunnels.ms/api/Pagos/Listar');
        const pagosData = await pagosResponse.json();
        const pagosCliente = pagosData.filter(pago => pago.iD_Cliente === parseInt(clienteId, 10));
        const pagosIds = pagosCliente.map(pago => pago.iD_Pago);

        localStorage.setItem('pagosIds', JSON.stringify(pagosIds));

        const pedidosResponse = await fetch('https://51r87rnm-7263.brs.devtunnels.ms/api/Pedidos/Listar');
        const pedidosData = await pedidosResponse.json();
        const pedidosCliente = pedidosData.filter(pedido => pagosIds.includes(pedido.iD_Pago));
        const pedidosIds = pedidosCliente.map(pedido => pedido.iD_Pedido);

        localStorage.setItem('pedidosIds', JSON.stringify(pedidosIds));

        const pedidoClientesResponse = await fetch('https://51r87rnm-7263.brs.devtunnels.ms/api/PedidoClientes/Listar');
        const pedidoClientesData = await pedidoClientesResponse.json();
        const pedidoClientesCliente = pedidoClientesData.filter(pedidoCliente => pedidosIds.includes(pedidoCliente.iD_Pedido));

        const pedidosConEstado = pedidoClientesCliente.map(pedidoCliente => {
          const pedido = pedidosCliente.find(p => p.iD_Pedido === pedidoCliente.iD_Pedido);
          return {
            ...pedidoCliente,
            estado_Pedido: pedido ? pedido.estado_Pedido : 'Desconocido',
          };
        });

        // Filtrar pedidos con ID par
        const pedidosFiltrados = pedidosConEstado.filter(pedido => pedido.iD_Pedido % 2 === 0);

        setPedidos(pedidosFiltrados);
      } catch (error) {
        console.error('Error al cargar los pedidos:', error);
      }
    };

    fetchPedidos();
  }, [clienteId]);

  return (
    <div className="Listar">
      <h1>Mis Pedidos</h1>
      {pedidos.length > 0 ? (
        <ul className="pedidos-list">
          {pedidos.map(pedido => (
            <li key={pedido.iD_Detalle_Pedido} className="pedido-item">
              <h3>Numero de Pedido: {pedido.iD_Pedido * 12}</h3>
              <p>Precio Unitario: {pedido.isPromotion ? pedido.precioConDescuento : pedido.precio_Unitario} Bs</p>
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

export default Listar;
