import React, { useEffect, useState } from 'react';
import './Notificaciones.css';

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [pagosIds, setPagosIds] = useState([]);
  const [clienteId, setClienteId] = useState(null);
  const [mostrarLeidas, setMostrarLeidas] = useState(true);

  useEffect(() => {
    const clienteId = localStorage.getItem('clienteId');
    setClienteId(clienteId);

    const fetchPagos = async () => {
      try {
        const response = await fetch('https://localhost:7263/api/Pagos/Listar');
        const data = await response.json();
        const pagosCliente = data.filter(pago => pago.iD_Cliente === parseInt(clienteId, 10));
        const pagosIds = pagosCliente.map(pago => pago.iD_Pago);
        setPagosIds(pagosIds);
      } catch (error) {
        console.error('Error al cargar los pagos:', error);
      }
    };

    fetchPagos();
  }, []);

  useEffect(() => {
    if (pagosIds.length > 0) {
      const fetchNotificaciones = async () => {
        try {
          const response = await fetch('https://localhost:7263/api/Notificaciones/Listar');
          const data = await response.json();
          const notificacionesFiltradas = data.filter(notificacion => pagosIds.includes(notificacion.pedido.iD_Pago));
          setNotificaciones(notificacionesFiltradas);
        } catch (error) {
          console.error('Error al cargar las notificaciones:', error);
        }
      };

      fetchNotificaciones();
    }
  }, [pagosIds]);

  const handleMarcarComoLeida = async (id) => {
    try {
      await fetch(`https://localhost:7263/api/Notificaciones/Actualizar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leido: 1 }),
      });
      setNotificaciones(notificaciones.map(notificacion => 
        notificacion.iD_Notificacion === id ? { ...notificacion, leido: 1 } : notificacion
      ));
    } catch (error) {
      console.error('Error al actualizar la notificación:', error);
    }
  };

  const handleMarcarComoNoLeida = async (id) => {
    try {
      await fetch(`https://localhost:7263/api/Notificaciones/Actualizar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leido: 0 }),
      });
      setNotificaciones(notificaciones.map(notificacion => 
        notificacion.iD_Notificacion === id ? { ...notificacion, leido: 0 } : notificacion
      ));
    } catch (error) {
      console.error('Error al actualizar la notificación:', error);
    }
  };

  const handleMostrarLeidas = () => {
    setMostrarLeidas(!mostrarLeidas);
  };

  return (
    <div className="notificaciones-page">
      <h1>Notificaciones</h1>
      <button onClick={handleMostrarLeidas}>
        {mostrarLeidas ? 'Ocultar leídas' : 'Mostrar todas'}
      </button>
      {notificaciones.length > 0 ? (
        <ul>
          {notificaciones.map(notificacion => (
            <li key={notificacion.iD_Notificacion} className={notificacion.leido && !mostrarLeidas ? 'hidden' : ''}>
              <p>{notificacion.contenido_Notificacion}</p>
              <p>Estado del Pedido: {notificacion.pedido.estado_Pedido}</p>
              <span>{new Date(notificacion.fecha_Envio).toLocaleString()}</span>
              {notificacion.leido ? (
                <button onClick={() => handleMarcarComoNoLeida(notificacion.iD_Notificacion)}>No leída</button>
              ) : (
                <button onClick={() => handleMarcarComoLeida(notificacion.iD_Notificacion)}>Marcar como leída</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes notificaciones.</p>
      )}
    </div>
  );
};

export default Notificaciones;
