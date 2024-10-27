import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompletarPerfil = ({ setUsuarioCompleto }) => {
  const [nombreCliente, setNombreCliente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [preferenciasAlimenticias, setPreferenciasAlimenticias] = useState('');
  const [usuarioId, setUsuarioId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('usuarioId');
    if (id) {
      setUsuarioId(id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const idUsuario = parseInt(localStorage.getItem('usuarioId'), 10);

    if (!idUsuario) {
      alert("No se encontró el ID de usuario.");
      return;
    }

    const response = await fetch('https://localhost:7263/api/Clientes/Insertar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ID_Cliente: 0,
        Nombre_Cliente: nombreCliente,
        Direccion: direccion,
        Telefono: parseInt(telefono, 10),
        Preferencias_Alimenticias: preferenciasAlimenticias,
        ID_Usuario: idUsuario,
      }),
    });

    if (response.ok) {
      alert('Perfil completado exitosamente');
      navigate('/'); // Redirige a Home.jsx
    } else {
      const errorData = await response.json();
      alert(`Error al completar el perfil: ${errorData.errors?.cliente || 'Error desconocido'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
          required
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
      <button type="submit">Completar Perfil</button>
    </form>
  );
};

export default CompletarPerfil;
