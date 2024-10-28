import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const AdminNavbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload(); // Recarga la página
  };

  const restauranteId = localStorage.getItem('restauranteId');

  if (!restauranteId) {
    return null;
  }

  return (
    <nav className="navbar-container">
      <div className="navbar-top">
        <Link to="/home-administrador" className="navbar-link">
          <button className="navbar-button">Inicio</button>
        </Link>
        <Link to="/menu-y-platos" className="navbar-link">
          <button className="navbar-button">Menú y Platos</button>
        </Link>
        <Link to="/pedidos" className="navbar-link">
          <button className="navbar-button">Pedidos</button>
        </Link>
        <Link to="/editar-perfil-admin" className="navbar-link">
          <button className="navbar-button">Editar Perfil</button>
        </Link>
        <Link to="/promociones" className="navbar-link">
          <button className="navbar-button">Promociones</button>
        </Link>
      </div>
      <div className="navbar-bottom">
        <button className="navbar-button" onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
