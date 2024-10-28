import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MenuYPlatos.css';

const MenuYPlatos = ({ setIsLoggedIn }) => {
  const [menus, setMenus] = useState([]);
  const [platos, setPlatos] = useState([]);
  const [newPlato, setNewPlato] = useState({
    nombre_Plato: '',
    descripcion: '',
    categoria_Plato: '',
    precio_Referencia: 0,
    imagenUrl: '',
    iD_Promocion: 0,
  });
  const [imagenPlato, setImagenPlato] = useState(null);
  const [promociones, setPromociones] = useState([]);
  const [restauranteId, setRestauranteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('restauranteId');
    setRestauranteId(id);

    const fetchMenus = async () => {
      try {
        const response = await fetch('https://localhost:7263/api/Menus/Listar');
        const data = await response.json();
        const filteredMenus = data.filter(menu => menu.iD_Restaurante === parseInt(id, 10));
        setMenus(filteredMenus);
      } catch (error) {
        console.error('Error al cargar los menús:', error);
      }
    };

    const fetchPlatos = async () => {
      try {
        const response = await fetch('https://localhost:7263/api/Platos/Listar');
        const data = await response.json();
        const filteredPlatos = data.filter(plato => {
          const menu = menus.find(menu => menu.iD_Plato === plato.iD_Plato);
          return menu && menu.iD_Restaurante === parseInt(id, 10);
        });
        setPlatos(filteredPlatos);
      } catch (error) {
        console.error('Error al cargar los platos:', error);
      }
    };

    const fetchPromociones = async () => {
      try {
        const response = await fetch('https://localhost:7263/api/Promociones/Listar');
        const data = await response.json();
        setPromociones(data);
      } catch (error) {
        console.error('Error al cargar las promociones:', error);
      }
    };

    if (id) {
      fetchMenus();
      fetchPlatos();
      fetchPromociones();
    }
  }, [menus]);

  const handleFileChange = (e) => {
    setImagenPlato(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlato((prevPlato) => ({
      ...prevPlato,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imagenUrl = newPlato.imagenUrl;

    if (imagenPlato) {
      const formData = new FormData();
      formData.append('file', imagenPlato);
      formData.append('fileName', imagenPlato.name);

      const uploadResponse = await fetch(`https://localhost:7263/api/Usuarios/SubirImagen?fileName=${imagenPlato.name}`, {
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

    const platoData = { ...newPlato, imagenUrl };

    try {
      const response = await fetch('https://localhost:7263/api/Platos/Insertar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(platoData),
      });

      if (response.ok) {
        const plato = await response.json();
        const menuData = {
          iD_Menu: 0,
          descripcion: 'Nuevo menú',
          disponibilidad: 1,
          iD_Restaurante: restauranteId,
          iD_Plato: plato.iD_Plato,
        };

        const menuResponse = await fetch('https://localhost:7263/api/Menus/Insertar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(menuData),
        });

        if (menuResponse.ok) {
          alert('Plato y menú añadidos con éxito');
          setNewPlato({
            nombre_Plato: '',
            descripcion: '',
            categoria_Plato: '',
            precio_Referencia: 0,
            imagenUrl: '',
            iD_Promocion: 0,
          });
          setImagenPlato(null);
          fetchMenus();
          fetchPlatos();
        } else {
          alert('Error al añadir el menú');
        }
      } else {
        alert('Error al añadir el plato');
      }
    } catch (error) {
      console.error('Error al añadir el plato:', error);
    }
  };

  return (
    <div>
      <h1>Listar Menú</h1>
      <div>
        <ul>
          {platos.map((plato) => (
            <li key={plato.iD_Plato}>
              <img src={plato.imagenUrl} alt={plato.nombre_Plato} width="100" />
              {plato.nombre_Plato} - {plato.descripcion} ({plato.categoria_Plato}) - ${plato.precio_Referencia}
              <Link to={`/editar-plato/${plato.iD_Plato}`}>
                <button>Editar Plato</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Añadir Nuevo Plato</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre del Plato:</label>
            <input type="text" name="nombre_Plato" value={newPlato.nombre_Plato} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Descripción:</label>
            <input type="text" name="descripcion" value={newPlato.descripcion} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Categoría del Plato:</label>
            <input type="text" name="categoria_Plato" value={newPlato.categoria_Plato} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Precio de Referencia:</label>
            <input type="number" name="precio_Referencia" value={newPlato.precio_Referencia} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Imagen del Plato:</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <div>
            <label>Promoción:</label>
            <select name="iD_Promocion" value={newPlato.iD_Promocion} onChange={handleInputChange}>
              <option value="0">Sin Promoción</option>
              {promociones.map((promocion) => (
                <option key={promocion.iD_Promocion} value={promocion.iD_Promocion}>
                  {promocion.descripcion_Promocion}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Añadir Plato</button>
        </form>
      </div>
    </div>
  );
};

export default MenuYPlatos;
