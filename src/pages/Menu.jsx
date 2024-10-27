import React, { useEffect, useState } from 'react';
import './Menu.css';

const Menu = ({ isLoggedIn, handleAddToCart }) => {
  const [menus, setMenus] = useState([]);

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

  const groupedMenus = groupByRestaurant(menus);

  return (
    <div className="menu-page">
      {isLoggedIn ? (
        <>
          <section className="banner">
            <h1>¡Bienvenido de nuevo a DeliveryApp!</h1>
            <p>Explora los platos recomendados para ti.</p>
          </section>

          {Object.keys(groupedMenus).map((restaurantName) => (
            <section key={restaurantName} className="menu-section">
              <h2>{restaurantName}</h2>
              <div className="scrollable-dishes">
                {groupedMenus[restaurantName].map((menu) => (
                  <div key={menu.iD_Plato} className="dish">
                    <img src={menu.palto.imagenUrl} alt={menu.palto.nombre_Plato} />
                    <h3>{menu.palto.nombre_Plato}</h3>
                    <p>{menu.palto.descripcion}</p>
                    <p>Precio: {menu.palto.precio_Referencia} Bs</p>
                    <button onClick={() => handleAddToCart(menu.palto)}>Añadir al carrito</button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </>
      ) : (
        <>
          <section className="banner">
            <h1>¡Bienvenido a DeliveryApp!</h1>
            <p>Inicia sesión para explorar nuestros deliciosos platos.</p>
          </section>
          {Object.keys(groupedMenus).map((restaurantName) => (
            <section key={restaurantName} className="menu-section">
              <h2>{restaurantName}</h2>
              <div className="scrollable-dishes">
                {groupedMenus[restaurantName].map((menu) => (
                  <div key={menu.iD_Plato} className="dish">
                    <img src={menu.palto.imagenUrl} alt={menu.palto.nombre_Plato} />
                    <h3>{menu.palto.nombre_Plato}</h3>
                    <p>{menu.palto.descripcion}</p>
                    <p>Precio: {menu.palto.precio_Referencia} Bs</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
};

export default Menu;
