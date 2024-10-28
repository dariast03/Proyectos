import React, { useEffect, useState } from 'react';
import './Inicio.css';

const Home = ({ isLoggedIn, usuarioCompleto, handleAddToCart }) => {
  const [platos, setPlatos] = useState([]);

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    const clienteId = localStorage.getItem('clienteId');
    if (usuarioId) {
      if (clienteId) {
        // Usuario completo
      } else {
        const verificarPerfilCompleto = async (reintentos = 3) => {
          for (let i = 0; i < reintentos; i++) {
            try {
              const response = await fetch('https://localhost:7263/api/Clientes/Listar');
              if (response.ok) {
                const clientes = await response.json();
                const cliente = clientes.find(c => c.iD_Usuario === parseInt(usuarioId, 10));
                if (cliente) {
                  localStorage.setItem('clienteId', cliente.iD_Cliente);
                  break;
                }
              }
            } catch (error) {
              console.error('Error al verificar el perfil del usuario:', error);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        };

        verificarPerfilCompleto();
      }
    }
    const fetchPlatos = async () => {
      try {
        const response = await fetch('https://localhost:7263/api/Platos/Listar');
        const data = await response.json();
        setPlatos(data);
      } catch (error) {
        console.error('Error al cargar los platos:', error);
      }
    };

    fetchPlatos();
  }, []);

  return (
    <div className="home-container">
      {isLoggedIn ? (
        <>
          <section className="home-banner">
            <h1>¡Bienvenido de nuevo a DeliveryApp!</h1>
            <p>Explora los platos recomendados para ti.</p>
          </section>

          <section className="home-menu-dia">
            <h2>Menú del Día</h2>
            <div className="home-scrollable-dishes">
              {platos.map(plato => (
                <div key={plato.iD_Plato} className="home-dish-card">
                  <img src={plato.imagenUrl} alt={plato.nombre_Plato} />
                  <h3>{plato.nombre_Plato}</h3>
                  <p>{plato.descripcion}</p>
                  <p className="home-price">Precio: {plato.precio_Referencia} Bs</p>
                  <button className="home-add-cart-button" onClick={() => handleAddToCart(plato)}>
                    Añadir al carrito
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="home-banner">
            <h1>¡Bienvenido a DeliveryApp!</h1>
            <p>Inicia sesión para explorar nuestros deliciosos platos.</p>
          </section>
          <section className="home-menu-dia">
            <h2>Menú del Día (para visitantes)</h2>
            <div className="home-scrollable-dishes">
              {platos.map(plato => (
                <div key={plato.iD_Plato} className="home-dish-card">
                  <img src={plato.imagenUrl} alt={plato.nombre_Plato} />
                  <h3>{plato.nombre_Plato}</h3>
                  <p>{plato.descripcion}</p>
                  <p className="home-price">Precio: {plato.precio_Referencia} Bs</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
