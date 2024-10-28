import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileMenu from './Perfil';
import './Navbar.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn, carrito }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imagenPerfilUrl, setImagenPerfilUrl] = useState('');
  const [notificaciones, setNotificaciones] = useState([]);
  const [clienteId, setClienteId] = useState(null);

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    const storedClienteId = localStorage.getItem('clienteId');
    setClienteId(storedClienteId);

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
        const notificacionesFiltradas = data.filter(notificacion => 
          notificacion.pedido && notificacion.pedido.pago && notificacion.pedido.pago.iD_Cliente === parseInt(storedClienteId, 10)
        );
        setNotificaciones(notificacionesFiltradas);
      } catch (error) {
        console.error('Error al cargar las notificaciones:', error);
      }
    };

    if (storedClienteId) {
      fetchNotificaciones();
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar-container">
      <div className="navbar-top">
        <Link to="/" className="navbar-link">
          <button className="navbar-button">Inicio</button>
        </Link>
        <Link to="/Menu" className="navbar-link">
          <button className="navbar-button">Menú</button>
        </Link>
        <Link to="/Promotions" className="navbar-link">
          <button className="navbar-button">Promociones</button>
        </Link>
      </div>
      
      <div className="navbar-bottom">
        {clienteId && (
          <>
            <Link to="/notificaciones" className="navbar-link">
              <div className="navbar-notifications-icon">
                🔔
                {notificaciones.length > 0 && <span className="navbar-notifications-count">{notificaciones.length}</span>}
              </div>
            </Link>
            <Link to="/carrito" className="navbar-link">
              <div className="navbar-cart-icon">
                🛒
                {carrito.length > 0 && <span className="navbar-cart-count">{carrito.length}</span>}
              </div>
            </Link>
          </>
        )}
        <div className="navbar-profile-icon" onClick={toggleMenu}>
          {imagenPerfilUrl ? (
            <img src={imagenPerfilUrl} alt="Perfil" className="navbar-profile-image" />
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
