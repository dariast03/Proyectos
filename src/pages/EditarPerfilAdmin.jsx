import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditarPerfilAdmin = ({ setIsLoggedIn }) => {
  const [modo, setModo] = useState(null); // 'usuario' o 'restaurante'
  const [usuario, setUsuario] = useState(null);
  const [restaurante, setRestaurante] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [imagenPerfilUrl, setImagenPerfilUrl] = useState('');
  const [nombreRestaurante, setNombreRestaurante] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [categoriaCocina, setCategoriaCocina] = useState('');
  const [horarioApertura, setHorarioApertura] = useState('');
  const [horarioCierre, setHorarioCierre] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    const restauranteId = localStorage.getItem('restauranteId');

    if (modo === 'usuario' && usuarioId) {
      fetch(`https://localhost:7263/api/Usuarios/Buscar/${usuarioId}`)
        .then(response => response.json())
        .then(data => {
          setUsuario(data);
          setNombreUsuario(data.nombre_Usuario || '');
          setEmail(data.email || '');
          setContrasena(data.contrasena || '');
          setImagenPerfilUrl(data.imagenPerfilUrl || '');
          setRolUsuario(data.rol_Usuario || '');
          setFechaRegistro(data.fecha_Registro || '');
        })
        .catch(error => console.error('Error al cargar el usuario:', error));
    } else if (modo === 'restaurante' && restauranteId) {
      fetch(`https://localhost:7263/api/Restaurantes/Buscar/${restauranteId}`)
        .then(response => response.json())
        .then(data => {
          setRestaurante(data);
          setNombreRestaurante(data.nombre_Restaurante || '');
          setDireccion(data.direccion || '');
          setTelefono(data.telefono || '');
          setCategoriaCocina(data.categoria_Cocina || '');
          setEmail(data.email || '');
          setHorarioApertura(data.horario_Apertura ? data.horario_Apertura.split('T')[0] : '');
          setHorarioCierre(data.horario_Cierre ? data.horario_Cierre.split('T')[0] : '');
        })
        .catch(error => console.error('Error al cargar el restaurante:', error));
    }
  }, [modo]);

  const handleFileChange = (e) => {
    setImagenPerfil(e.target.files[0]);
  };

  const handleSubmitUsuario = async (e) => {
    e.preventDefault();
    const usuarioId = localStorage.getItem('usuarioId');

    let imagenUrl = imagenPerfilUrl;
    if (imagenPerfil) {
      const formData = new FormData();
      formData.append('file', imagenPerfil);
      formData.append('fileName', imagenPerfil.name);

      const uploadResponse = await fetch(`https://localhost:7263/api/Usuarios/SubirImagen?fileName=${imagenPerfil.name}`, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        imagenUrl = `src/img/perfil/${imagenPerfil.name}`;
      } else {
        alert('Error al subir la imagen');
        return;
      }
    }

    const response = await fetch(`https://localhost:7263/api/Usuarios/Actualizar/${usuarioId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        iD_Usuario: usuarioId,
        nombre_Usuario: nombreUsuario,
        email: email,
        contrasena: contrasena,
        rol_Usuario: rolUsuario,
        fecha_Registro: fechaRegistro,
        imagenPerfilUrl: imagenUrl,
      }),
    });

    if (response.ok) {
      alert('Perfil de usuario actualizado exitosamente');
      navigate('/home-administrador');
    } else {
      alert('Error al actualizar el perfil de usuario');
    }
  };

  const handleSubmitRestaurante = async (e) => {
    e.preventDefault();
    const restauranteId = localStorage.getItem('restauranteId');
    const usuarioId = localStorage.getItem('usuarioId');
    const response = await fetch(`https://localhost:7263/api/Restaurantes/Actualizar/${restauranteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        iD_Restaurante: restauranteId,
        nombre_Restaurante: nombreRestaurante,
        direccion: direccion,
        telefono: telefono,
        categoria_Cocina: categoriaCocina,
        email: email,
        horario_Apertura: horarioApertura,
        horario_Cierre: horario_Cierre,
        iD_Usuario: usuarioId,
      }),
    });

    if (response.ok) {
      alert('Perfil de restaurante actualizado exitosamente');
      navigate('/home-administrador');
    } else {
      alert('Error al actualizar el perfil de restaurante');
    }
  };

  return (
    <div>
      <h1>Editar Perfil</h1>
      <div>
        <button onClick={() => setModo('usuario')}>Editar Perfil Usuario</button>
        <button onClick={() => setModo('restaurante')}>Editar Perfil Restaurante</button>
      </div>

      {modo === 'usuario' && usuario && (
        <form onSubmit={handleSubmitUsuario}>
          <div>
            <label>Nombre de Usuario:</label>
            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Contraseña:</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Imagen de Perfil:</label>
            <input
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit">Actualizar Perfil Usuario</button>
        </form>
      )}

      {modo === 'restaurante' && restaurante && (
        <form onSubmit={handleSubmitRestaurante}>
          <div>
            <label>Nombre del Restaurante:</label>
            <input
              type="text"
              value={nombreRestaurante}
              onChange={(e) => setNombreRestaurante(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Dirección:</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </div>
          <div>
            <label>Teléfono:</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Categoría de Cocina:</label>
            <input
              type="text"
              value={categoriaCocina}
              onChange={(e) => setCategoriaCocina(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Horario de Apertura:</label>
            <input
              type="date"
              value={horarioApertura}
              onChange={(e) => setHorarioApertura(e.target.value)}
            />
          </div>
          <div>
            <label>Horario de Cierre:</label>
            <input
              type="date"
              value={horarioCierre}
              onChange={(e) => setHorarioCierre(e.target.value)}
            />
          </div>
          <button type="submit">Actualizar Perfil Restaurante</button>
        </form>
      )}
    </div>
  );
};

export default EditarPerfilAdmin;
