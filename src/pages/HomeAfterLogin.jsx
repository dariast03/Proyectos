// src/pages/HomeAfterLogin.jsx
import React from 'react';
import './Home.css';

const HomeAfterLogin = () => {
  return (
    <div className="home">
      <section className="banner">
        <h1>¡Bienvenido de nuevo a DeliveryApp!</h1>
        <p>Explora los platos recomendados para ti.</p>
      </section>

      <section className="menu-dia">
        <h2>Menu del Día</h2>
        <div className="scrollable-dishes">
          <div className="dish">Plato 1</div>
          <div className="dish">Plato 2</div>
          <div className="dish">Plato 3</div>
          {/* More placeholder dishes */}
        </div>
      </section>

      <section className="order-history">
        <h2>Tus Pedidos Recientes</h2>
        <div className="orders">
          <div className="order">Pedido 1</div>
          <div className="order">Pedido 2</div>
          <div className="order">Pedido 3</div>
          {/* More placeholder orders */}
        </div>
      </section>
    </div>
  );
};

export default HomeAfterLogin;
