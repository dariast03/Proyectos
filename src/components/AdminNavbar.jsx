import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const AdminNavbar = ({ setIsLoggedIn }) => {
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <nav className="deliveryApp-navbar">
      <div className="deliveryApp-navbar-left">
        <Link to="/home-administrador">Inicio</Link>
        <Link to="/menu-y-platos">Menú y Platos</Link>
        <Link to="/pedidos">Pedidos</Link>
        <Link to="/editar-perfil-admin">Editar Perfil</Link>
        <Link to="/promociones">Promociones</Link>
      </div>
      <div className="deliveryApp-navbar-right">
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
