import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import './Navbar.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn, carrito }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imagenPerfilUrl, setImagenPerfilUrl] = useState('');
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    if (usuarioId) {
      fetch(`https://localhost:7263/api/Usuarios/Buscar/${usuarioId}`)
        .then(response => response.json())
        .then(data => {
          setImagenPerfilUrl(data.imagenPerfilUrl);
        })
        .catch(error => console.error('Error al cargar la imagen de perfil:', error));
    }

    const fetchNotificaciones = async () => {
      try {
        const response = await fetch('https://localhost:7263/api/Notificaciones/Listar');
        const data = await response.json();
        const clienteId = localStorage.getItem('clienteId');
        const notificacionesFiltradas = data.filter(notificacion => 
          notificacion.pedido && notificacion.pedido.pago && notificacion.pedido.pago.iD_Cliente === parseInt(clienteId, 10)
        );
        setNotificaciones(notificacionesFiltradas);
      } catch (error) {
        console.error('Error al cargar las notificaciones:', error);
      }
    };

    fetchNotificaciones();
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="deliveryApp-navbar">
      <div className="deliveryApp-navbar-left">
        <Link to="/">
          <button>Inicio</button>
        </Link>
        <Link to="/Menu">
          <button>Menú</button>
        </Link>
        <Link to="/Promotions">
          <button>Promociones</button>
        </Link>
      </div>
      
      <div className="deliveryApp-navbar-right">
        <Link to="/notificaciones">
          <div className="deliveryApp-notifications-icon">
            🔔
            {notificaciones.length > 0 && <span className="deliveryApp-notifications-count">{notificaciones.length}</span>}
          </div>
        </Link>
        <Link to="/carrito">
          <div className="deliveryApp-cart-icon">
            🛒
            {carrito.length > 0 && <span className="deliveryApp-cart-count">{carrito.length}</span>}
          </div>
        </Link>
        <div className="deliveryApp-profile-icon" onClick={toggleMenu}>
          {imagenPerfilUrl ? (
            <img src={imagenPerfilUrl} alt="Perfil" />
          ) : (
            <span role="img" aria-label="profile">👤</span>
          )}
        </div>
      </div>
      
      {menuOpen && <ProfileMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
    </nav>
  );
};

export default Navbar;
