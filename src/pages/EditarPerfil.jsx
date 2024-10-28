import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditarPerfil.css'

const EditarPerfil = () => {
  const [modo, setModo] = useState(null); // 'usuario' o 'cliente'
  const [usuario, setUsuario] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [imagenPerfilUrl, setImagenPerfilUrl] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [preferenciasAlimenticias, setPreferenciasAlimenticias] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    const clienteId = localStorage.getItem('clienteId');

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
    } else if (modo === 'cliente' && clienteId) {
      fetch(`https://localhost:7263/api/Clientes/Buscar/${clienteId}`)
        .then(response => response.json())
        .then(data => {
          setCliente(data);
          setNombreCliente(data.nombre_Cliente || '');
          setDireccion(data.direccion || '');
          setTelefono(data.telefono || '');
          setPreferenciasAlimenticias(data.preferencias_Alimenticias || '');
        })
        .catch(error => console.error('Error al cargar el cliente:', error));
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
      navigate('/');
    } else {
      alert('Error al actualizar el perfil de usuario');
    }
  };

  const handleSubmitCliente = async (e) => {
    e.preventDefault();
    const clienteId = localStorage.getItem('clienteId');
    const usuarioId = localStorage.getItem('usuarioId');
    const response = await fetch(`https://localhost:7263/api/Clientes/Actualizar/${clienteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        iD_Cliente: clienteId,
        nombre_Cliente: nombreCliente,
        direccion: direccion,
        telefono: telefono,
        preferencias_Alimenticias: preferenciasAlimenticias,
        iD_Usuario: usuarioId,
      }),
    });

    if (response.ok) {
      alert('Perfil de cliente actualizado exitosamente');
      navigate('/');
    } else {
      alert('Error al actualizar el perfil de cliente');
    }
  };

  return (
    <div>
      <h1>Editar Perfil</h1>
      <div>
        <button onClick={() => setModo('usuario')}>Editar Perfil Usuario</button>
        <button onClick={() => setModo('cliente')}>Editar Perfil Cliente</button>
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

      {modo === 'cliente' && cliente && (
        <form onSubmit={handleSubmitCliente}>
          <div>
            <label>Nombre del Cliente:</label>
            <input
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
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
              type="number"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Preferencias Alimenticias:</label>
            <input
              type="text"
              value={preferenciasAlimenticias}
              onChange={(e) => setPreferenciasAlimenticias(e.target.value)}
              required
            />
          </div>
          <button type="submit">Actualizar Perfil Cliente</button>
        </form>
      )}
    </div>
  );
};

export default EditarPerfil;
