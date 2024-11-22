import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = ({ setIsLoggedIn, setUsuarioCompleto }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://localhost:7263/api/Usuarios/Insertar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        iD_Usuario: 0,
        nombre_Usuario: nombreUsuario,
        email: email,
        contrasena: contrasena,
        rol_Usuario: 'cliente',
        fecha_Registro: new Date().toISOString().split('T')[0],
      }),
    });
    
    if (response.ok) {
     
      const usuariosResponse = await fetch('https://localhost:7263/api/Usuarios/Listar');
      if (usuariosResponse.ok) {
        const usuarios = await usuariosResponse.json();
  
        const usuario = usuarios.find(u => 
          u.nombre_Usuario === nombreUsuario && 
          u.email === email && 
          u.contrasena === contrasena
        );
        if (usuario) {
    
          localStorage.setItem('usuarioId', usuario.iD_Usuario);
          setIsLoggedIn(true);
          checkCompletarPerfil(usuario.iD_Usuario);
          navigate('/');
        } else {
          alert('Error al encontrar el ID del usuario');
        }
      } else {
        alert('Error al listar los usuarios');
      }
    } else {
      alert('Error al crear el usuario');
    }
  };

  const checkCompletarPerfil = async (userId) => {
    if (!userId) {
      console.error('No se ha proporcionado un ID de usuario');
      return;
    }

    const clientesResponse = await fetch('https://localhost:7263/api/Clientes/Listar');
    if (clientesResponse.ok) {
      const clientes = await clientesResponse.json();
   
      const cliente = clientes.find(c => c.iD_Usuario === userId);
      if (cliente) {
      
        localStorage.setItem('clienteId', cliente.iD_Cliente);
        setUsuarioCompleto(true);
        navigate('/');
      } else {
        const response = await fetch(`https://localhost:7263/api/Usuarios/Buscar/${userId}`);
        if (response.ok) {
          const cliente = await response.json();
          if (!cliente) {
            navigate('/Cliente');
          }
        } else {
          console.error('Error al buscar el cliente');
        }
      }
    } else {
      alert('Error al listar los clientes');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Crear Usuario</button>
    </form>
  );
};

export default CreateUser;
