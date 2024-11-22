import React, { useEffect, useState } from 'react';

const Pedidos = ({ setIsLoggedIn }) => {
  const [menus, setMenus] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [detallePedidos, setDetallePedidos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [restauranteId, setRestauranteId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('restauranteId');
    setRestauranteId(id);

    const fetchData = async () => {
      try {
       
        const menusResponse = await fetch('https://localhost:7263/api/Menus/Listar');
        const menusData = await menusResponse.json();
        const filteredMenus = menusData.filter(menu => menu.iD_Restaurante === parseInt(id, 10));
        setMenus(filteredMenus);

       
        const platosResponse = await fetch('https://localhost:7263/api/Platos/Listar');
        const platosData = await platosResponse.json();
        const menuPlatoIds = filteredMenus.map(menu => menu.iD_Plato);
        const filteredPlatos = platosData.filter(plato => menuPlatoIds.includes(plato.iD_Plato));
        setPlatos(filteredPlatos);

  
        const detallePedidosResponse = await fetch('https://localhost:7263/api/PedidoClientes/Listar');
        const detallePedidosData = await detallePedidosResponse.json();
        const platoIds = filteredPlatos.map(plato => plato.iD_Plato);
        const filteredDetallePedidos = detallePedidosData.filter(detalle => platoIds.includes(detalle.iD_Plato));
        setDetallePedidos(filteredDetallePedidos);

    
        const pedidosResponse = await fetch('https://localhost:7263/api/Pedidos/Listar');
        const pedidosData = await pedidosResponse.json();
        const pedidoIds = filteredDetallePedidos.map(detalle => detalle.iD_Pedido);
        const filteredPedidos = pedidosData.filter(pedido => pedidoIds.includes(pedido.iD_Pedido));
        setPedidos(filteredPedidos);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    if (id) {
      fetchData();
    }
  }, []);

  const handleEstadoChange = async (e, pedido) => {
    const nuevoEstado = e.target.value;
    const updatedPedido = {
      ...pedido,
      estado_Pedido: nuevoEstado,
    };

    try {
      const response = await fetch(`https://localhost:7263/api/Pedidos/Actualizar/${pedido.iD_Pedido}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPedido),
      });

      if (response.ok) {
        setPedidos(pedidos.map(p => (p.iD_Pedido === pedido.iD_Pedido ? updatedPedido : p)));
        alert('Estado del pedido actualizado con éxito');
      } else {
        alert('Error al actualizar el estado del pedido');
      }
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
    }
  };

  return (
    <div>
      <h1>Pedidos</h1>
      <div>
        <h2>Lista de Pedidos</h2>
        <ul>
          {pedidos.map(pedido => (
            <li key={pedido.iD_Pedido}>
              <p>Fecha: {new Date(pedido.fecha_Pedido).toLocaleDateString()}</p>
              <p>Total: ${pedido.total_Pedido}</p>
              <p>Estado: 
                <select value={pedido.estado_Pedido} onChange={(e) => handleEstadoChange(e, pedido)}>
                  <option value="preparacion">Preparación</option>
                  <option value="enviado">Enviado</option>
                  <option value="terminado">Terminado</option>
                </select>
              </p>
              <h3>Detalles del Pedido:</h3>
              <ul>
                {detallePedidos.filter(detalle => detalle.iD_Pedido === pedido.iD_Pedido).map(detalle => {
                  const plato = platos.find(plato => plato.iD_Plato === detalle.iD_Plato);
                  return (
                    <li key={detalle.iD_Detalle_Pedido}>
                      {plato ? (
                        <>
                          <img src={plato.imagenUrl} alt={plato.nombre_Plato} width="100" />
                          <p>{plato.nombre_Plato} - ${detalle.precio_Unitario}</p>
                        </>
                      ) : (
                        <p>Plato no encontrado</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Pedidos;
