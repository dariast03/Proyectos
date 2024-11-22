import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Plato.css';

const EditarPlato = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plato, setPlato] = useState(null);
  const [imagenPlato, setImagenPlato] = useState(null);

  useEffect(() => {
    const fetchPlato = async () => {
      try {
        const response = await fetch(`https://sj3qgblc-7263.brs.devtunnels.ms/api/Platos/Buscar/${id}`);
        const data = await response.json();
        setPlato(data);
      } catch (error) {
        console.error('Error al cargar el plato:', error);
      }
    };

    fetchPlato();
  }, [id]);

  const handleFileChange = (e) => {
    setImagenPlato(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlato((prevPlato) => ({
      ...prevPlato,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imagenUrl = plato.imagenUrl;

    if (imagenPlato) {
      const formData = new FormData();
      formData.append('file', imagenPlato);
      formData.append('fileName', imagenPlato.name);

      const uploadResponse = await fetch(`https://sj3qgblc-7263.brs.devtunnels.ms/api/Platos/SubirImagen?fileName=${imagenPlato.name}`, {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        imagenUrl = `src/img/platos/${imagenPlato.name}`;
      } else {
        alert('Error al subir la imagen');
        return;
      }
    }

    const platoData = { ...plato, imagenUrl };

    try {
      const response = await fetch(`https://sj3qgblc-7263.brs.devtunnels.ms/api/Platos/Actualizar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(platoData),
      });

      if (response.ok) {
        alert('Plato actualizado con éxito');
        navigate('/MenuAdmin');
      } else {
        alert('Error al actualizar el plato');
      }
    } catch (error) {
      console.error('Error al actualizar el plato:', error);
    }
  };

  if (!plato) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="editar-plato-container">
      <h1>Editar Plato</h1>
      <form onSubmit={handleSubmit} className="editar-plato-form">
        <div className="form-group">
          <label>Nombre del Plato:</label>
          <input type="text" name="nombre_Plato" value={plato.nombre_Plato} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <input type="text" name="descripcion" value={plato.descripcion} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Categoría del Plato:</label>
          <input type="text" name="categoria_Plato" value={plato.categoria_Plato} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Precio de Referencia:</label>
          <input type="number" name="precio_Referencia" value={plato.precio_Referencia} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Imagen del Plato:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit" className="editar-plato-button">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarPlato;
