import React, { useEffect, useState } from 'react';
import './Menu.css';

const Menu = ({ isLoggedIn, handleAddToCart }) => {
  const [menus, setMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('https://localhost:7263/api/Menus/Listar');
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error('Error al cargar los menús:', error);
      }
    };

    fetchMenus();
  }, []);

  const groupByRestaurant = (menus) => {
    return menus.reduce((acc, menu) => {
      const restaurantName = menu.restaurante.nombre_Restaurante;
      if (!acc[restaurantName]) {
        acc[restaurantName] = [];
      }
      acc[restaurantName].push(menu);
      return acc;
    }, {});
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPriceRange([0, e.target.value]);
  };

  const togglePriceFilter = () => {
    setShowPriceFilter(!showPriceFilter);
  };

  const filteredMenus = menus.filter(menu => {
    const matchesSearchTerm = menu.palto.nombre_Plato.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              menu.restaurante.nombre_Restaurante.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceRange = menu.palto.precio_Referencia >= priceRange[0] && menu.palto.precio_Referencia <= priceRange[1];
    return matchesSearchTerm && matchesPriceRange;
  });

  const groupedMenus = groupByRestaurant(filteredMenus);

  return (
    <div className="menu-page">
      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre de plato o restaurante..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
          <button className="filter-button" onClick={togglePriceFilter}>⚙️ Filtro de precios</button>
        </div>
        {showPriceFilter && (
          <div className="price-filter">
            <label>Rango de precios: 0 - {priceRange[1]} Bs</label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="price-range"
            />
          </div>
        )}
      </section>

      {Object.keys(groupedMenus).map((restaurantName) => (
        <section key={restaurantName} className="menu-section">
          <h2>{restaurantName}</h2>
          <div className="scrollable-dishes-horizontal">
            {groupedMenus[restaurantName].map((menu) => (
              <div key={menu.iD_Plato} className="dish">
                <img src={menu.palto.imagenUrl} alt={menu.palto.nombre_Plato} />
                <h3>{menu.palto.nombre_Plato}</h3>
                <p>{menu.palto.descripcion}</p>
                <p>Precio: {menu.palto.precio_Referencia} Bs</p>
                {isLoggedIn && (
                  <button onClick={() => handleAddToCart(menu.palto)}>Añadir al carrito</button>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Menu;
