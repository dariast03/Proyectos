import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Perfil.css';

const ProfileMenu = ({ isLoggedIn, setIsLoggedIn }) => {
  const [imagenPerfilUrl, setImagenPerfilUrl] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    if (usuarioId) {
      fetch(`https://51r87rnm-7263.brs.devtunnels.ms/api/Usuarios/Buscar/${usuarioId}`)
        .then(response => response.json())
        .then(data => {
          setImagenPerfilUrl(data.imagenPerfilUrl);
        })
        .catch(error => console.error('Error al cargar la imagen de perfil:', error));
    }
  }, []);

  const handleLogout = () => {
    // Eliminar todos los elementos del localStorage
    localStorage.clear();
    // Actualizar el estado para indicar que el usuario ha cerrado sesión
    setIsLoggedIn(false);
    // Redirigir al usuario a la página de inicio
    navigate('/');
    // Recargar la página para eliminar la imagen de perfil residual
    window.location.reload();
  };

  return (
    <div className="profile-menu">
      {isLoggedIn ? (
        <div>
          {imagenPerfilUrl && (
            <div className="profile-picture">
              <img src={imagenPerfilUrl} alt="Perfil" />
            </div>
          )}
          <Link to="/Editar">
            <button>Editar Perfil</button>
          </Link>
          <Link to="/Listar">
            <button>Ver Pedidos</button>
          </Link>
          <Link to="/escribir-resena">
            <button>Escribir Reseña</button>
          </Link>
          <button onClick={handleLogout}>Cerrar Sesión</button> {/* Botón de Cerrar Sesión */}
        </div>
      ) : (
        <div>
          <Link to="/Sesion">
            <button>Iniciar Sesión</button>
          </Link>
          <Link to="/Registro">
            <button>Registrarse</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
