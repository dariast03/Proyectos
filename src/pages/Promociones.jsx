import React, { useEffect, useState } from 'react';
import './Promociones.css';

const Promociones = ({ setIsLoggedIn }) => {
  const [promociones, setPromociones] = useState([]);
  const [newPromocion, setNewPromocion] = useState({
    descripcion_Promocion: '',
    fecha_Inicio: '',
    fecha_Fin: '',
    descuento: 0,
  });
  const [editingPromocion, setEditingPromocion] = useState(null);

  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const response = await fetch('https://sj3qgblc-7263.brs.devtunnels.ms/api/Promociones/Listar');
        const data = await response.json();
        setPromociones(data);
      } catch (error) {
        console.error('Error al cargar las promociones:', error);
      }
    };

    fetchPromociones();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromocion((prevPromocion) => ({
      ...prevPromocion,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPromocion((prevPromocion) => ({
      ...prevPromocion,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://sj3qgblc-7263.brs.devtunnels.ms/api/Promociones/Insertar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPromocion),
      });

      if (response.ok) {
        alert('Promoción añadida con éxito');
        setNewPromocion({
          descripcion_Promocion: '',
          fecha_Inicio: '',
          fecha_Fin: '',
          descuento: 0,
        });
        const data = await response.json();
        setPromociones((prevPromociones) => [...prevPromociones, data]);
      } else {
        alert('Error al añadir la promoción');
      }
    } catch (error) {
      console.error('Error al añadir la promoción:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://sj3qgblc-7263.brs.devtunnels.ms/api/Promociones/Actualizar/${editingPromocion.iD_Promocion}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPromocion),
      });

      if (response.ok) {
        alert('Promoción actualizada con éxito');
        setPromociones(promociones.map(p => (p.iD_Promocion === editingPromocion.iD_Promocion ? editingPromocion : p)));
        setEditingPromocion(null);
      } else {
        alert('Error al actualizar la promoción');
      }
    } catch (error) {
      console.error('Error al actualizar la promoción:', error);
    }
  };

  return (
    <div>
      <h1 className="promociones-title">Promociones</h1>
      <div className="promociones-list">
        <h2 className="promociones-subtitle">Lista de Promociones</h2>
        <ul className="promociones-ul">
          {promociones.map(promocion => (
            <li key={promocion.iD_Promocion} className="promociones-item">
              <p className="promociones-description">{promocion.descripcion_Promocion} - {promocion.descuento}%</p>
              <p className="promociones-date">Inicio: {new Date(promocion.fecha_Inicio).toLocaleDateString()}</p>
              <p className="promociones-date">Fin: {new Date(promocion.fecha_Fin).toLocaleDateString()}</p>
              <button className="promociones-button" onClick={() => setEditingPromocion(promocion)}>Editar Promoción</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="promociones-add">
        <h2 className="promociones-subtitle">Añadir Nueva Promoción</h2>
        <form onSubmit={handleSubmit} className="promociones-form">
          <div className="promociones-form-group">
            <label>Descripción:</label>
            <input type="text" name="descripcion_Promocion" value={newPromocion.descripcion_Promocion} onChange={handleInputChange} required />
          </div>
          <div className="promociones-form-group">
            <label>Fecha de Inicio:</label>
            <input type="date" name="fecha_Inicio" value={newPromocion.fecha_Inicio} onChange={handleInputChange} required />
          </div>
          <div className="promociones-form-group">
            <label>Fecha de Fin:</label>
            <input type="date" name="fecha_Fin" value={newPromocion.fecha_Fin} onChange={handleInputChange} required />
          </div>
          <div className="promociones-form-group">
            <label>Descuento:</label>
            <input type="number" name="descuento" value={newPromocion.descuento} onChange={handleInputChange} required />
          </div>
          <button type="submit" className="promociones-button">Añadir Promoción</button>
        </form>
      </div>
      {editingPromocion && (
        <div className="promociones-edit">
          <h2 className="promociones-subtitle">Editar Promoción</h2>
          <form onSubmit={handleEditSubmit} className="promociones-form">
            <div className="promociones-form-group">
              <label>Descripción:</label>
              <input type="text" name="descripcion_Promocion" value={editingPromocion.descripcion_Promocion} onChange={handleEditInputChange} required />
            </div>
            <div className="promociones-form-group">
              <label>Fecha de Inicio:</label>
              <input type="date" name="fecha_Inicio" value={editingPromocion.fecha_Inicio} onChange={handleEditInputChange} required />
            </div>
            <div className="promociones-form-group">
              <label>Fecha de Fin:</label>
              <input type="date" name="fecha_Fin" value={editingPromocion.fecha_Fin} onChange={handleEditInputChange} required />
            </div>
            <div className="promociones-form-group">
              <label>Descuento:</label>
              <input type="number" name="descuento" value={editingPromocion.descuento} onChange={handleEditInputChange} required />
            </div>
            <button type="submit" className="promociones-button">Guardar Cambios</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Promociones;
