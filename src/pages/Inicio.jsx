import React, { useEffect, useState } from 'react';
import './Inicio.css';

const Inicio = ({ isLoggedIn, handleAddToCart }) => {
  const [platos, setPlatos] = useState([]);
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');

    const fetchCliente = async () => {
      try {
        const response = await fetch('https://51r87rnm-7263.brs.devtunnels.ms/api/Clientes/Listar');
        const clientes = await response.json();
        const clienteEncontrado = clientes.find(c => c.iD_Usuario === parseInt(usuarioId, 10));
        if (clienteEncontrado) {
          localStorage.setItem('clienteId', clienteEncontrado.iD_Cliente); // Guardar el ID del cliente en el localStorage
          setCliente(clienteEncontrado);
        } else {
          console.error('Cliente no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar los datos del cliente:', error);
      }
    };

    if (isLoggedIn && usuarioId) {
      fetchCliente();
    }

    const fetchPlatos = async () => {
      try {
        const response = await fetch('https://51r87rnm-7263.brs.devtunnels.ms/api/Platos/Listar');
        const data = await response.json();
        setPlatos(data);
      } catch (error) {
        console.error('Error al cargar los platos:', error);
      }
    };

    fetchPlatos();
  }, [isLoggedIn]);

  return (
    <div className="home-container">
      {isLoggedIn ? (
        <>
          <section className="home-banner">
            {cliente ? (
              <>
                <img src={cliente.usuario.imagenPerfilUrl} alt="Perfil" className="home-profile-image" />
                <h1>¡Bienvenido de nuevo, {cliente.usuario.nombre_Usuario}!</h1>
              </>
            ) : (
              <h1>¡Bienvenido de nuevo a DeliveryApp!</h1>
            )}
            <p>Explora los platos recomendados para ti.</p>
          </section>

          <section
            className="home-menu-dia"
            style={{
              padding: "20px",
              textAlign: "center"
            }}
          >
            <h2>Menú del Día</h2>
            <div
              className="home-scrollable-dishes"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "20px",
                marginTop: "20px"
              }}
            >
              {platos.map(plato => (
                <div
                  key={plato.iD_Plato}
                  className="home-dish-card"
                  style={{
                    width: "200px",
                    padding: "15px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    textAlign: "center",
                    backgroundColor: "#fff"
                  }}
                >
                  <img
                    src={plato.imagenUrl}
                    alt={plato.nombre_Plato}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                  <h3 style={{ fontSize: "1.2em", margin: "10px 0" }}>{plato.nombre_Plato}</h3>
                  <p style={{ fontSize: "0.9em", color: "#555" }}>{plato.descripcion}</p>
                  <p className="home-price" style={{ fontWeight: "bold", marginTop: "10px" }}>
                    Precio: {plato.precio_Referencia} Bs
                  </p>
                  <button
                    className="home-add-cart-button"
                    style={{
                      marginTop: "10px",
                      padding: "8px 16px",
                      backgroundColor: "#ff6f61",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                    onClick={() => handleAddToCart(plato)}
                  >
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

export default Inicio;
