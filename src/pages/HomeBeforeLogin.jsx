// src/pages/HomeBeforeLogin.jsx
import React from 'react';
import './Home.css';

const HomeBeforeLogin = () => {
  return (
    <div className="home">
      <section className="banner">
        <h1>Bienvenido a DeliveryApp</h1>
        <p>¡Tu comida favorita, al alcance de un clic!</p>
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
    </div>
  );
};

export default HomeBeforeLogin;
