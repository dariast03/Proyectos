import React, { useState, useEffect } from 'react';
import './NotificacionAdmin.css';

const NotificacionAdmin = () => {
  const [contenido, setContenido] = useState('');
  const [estadoPedido, setEstadoPedido] = useState('');
  const [fechaEnvio, setFechaEnvio] = useState(new Date().toISOString().slice(0, 16));
  const [platos, setPlatos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [idPedido, setIdPedido] = useState('');

  useEffect(() => {
    const restauranteId = localStorage.getItem('restauranteId');

    const fetchMenus = async () => {
      try {
        const response = await fetch('https://localhost:7263/api/Menus/Listar');
        const data = await response.json();
        const platosRestaurante = data.filter(menu => menu.iD_Restaurante === parseInt(restauranteId, 10)).map(menu => menu.iD_Plato);
        setPlatos(platosRestaurante);
      } catch (error) {
        console.error('Error al cargar los menús:', error);
      }
    };

    fetchMenus();
  }, []);

  useEffect(() => {
    if (platos.length > 0) {
      const fetchPedidos = async () => {
        try {
          const response = await fetch('https://localhost:7263/api/PedidoClientes/Listar');
          const data = await response.json();
          const pedidosRestaurante = data.filter(pedido => platos.includes(pedido.iD_Plato));
          setPedidos(pedidosRestaurante);
        } catch (error) {
          console.error('Error al cargar los pedidos:', error);
        }
      };

      fetchPedidos();
    }
  }, [platos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7263/api/Notificaciones/Insertar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_Notificacion: 'Actualizacion',
          contenido_Notificacion: contenido,
          fecha_Envio: fechaEnvio,
          leido: 0,
          iD_Pedido: idPedido,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      alert('Notificación creada exitosamente');
      setContenido('');
      setEstadoPedido('');
      setFechaEnvio(new Date().toISOString().slice(0, 16));
      setIdPedido('');
    } catch (error) {
      console.error('Error al crear la notificación:', error);
    }
  };

  return (
    <div className="notificacion-admin-page">
      <h1>Crear Notificación</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="contenido">Contenido:</label>
          <input
            type="text"
            id="contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="estadoPedido">Estado del Pedido:</label>
          <input
            type="text"
            id="estadoPedido"
            value={estadoPedido}
            onChange={(e) => setEstadoPedido(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="fechaEnvio">Fecha de Envío:</label>
          <input
            type="datetime-local"
            id="fechaEnvio"
            value={fechaEnvio}
            onChange={(e) => setFechaEnvio(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="idPedido">ID del Pedido:</label>
          <select
            id="idPedido"
            value={idPedido}
            onChange={(e) => setIdPedido(e.target.value)}
            required
          >
            <option value="">Selecciona un pedido</option>
            {pedidos.map(pedido => (
              <option key={pedido.iD_Pedido} value={pedido.iD_Pedido}>
                {`Pedido ${pedido.iD_Pedido} - ${pedido.pedido.estado_Pedido}`}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Crear Notificación</button>
      </form>
    </div>
  );
};

export default NotificacionAdmin;
