import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navegacion';
import AdminNavbar from './components/AdminNav';
import Inicio from './pages/Inicio';
import Administrador from './pages/Administrador';
import Sesion from './pages/Sesion';
import Registro from './pages/Registro';
import Cliente from './pages/Cliente';
import Editar from './pages/Editar';
import Listar from './pages/Listar';
import Carrito from './pages/Tienda';
import Pagos from './pages/Pagos';
import Procesando from './pages/Procesando';
import Exitoso from './pages/Exitoso';
import Menu from './pages/Menu';
import Promotions from './pages/Promotions';
import Notificaciones from './pages/Notificaciones';
import EscribirResena from './pages/Resenas';
import MenuAdmin from './pages/MenuAdmin';
import Pedidos from './pages/Pedidos';
import Promociones from './pages/Promociones';
import EditarAdmin from './pages/EditarAdmin';
import EditarPlato from './pages/Plato';
import NotificacionAdmin from './pages/NotificacionAdmin';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioCompleto, setUsuarioCompleto] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const usuarioId = localStorage.getItem('usuarioId');
    const clienteId = localStorage.getItem('clienteId');
    const restauranteId = localStorage.getItem('restauranteId');

    if (usuarioId) {
      setIsLoggedIn(true);
    }

    if (clienteId) {
      setUsuarioCompleto(true);
    }

    if (restauranteId) {
      setIsAdmin(true);
    }

    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const handleAddToCart = (plato, isPromotion = false) => {
    const nuevoCarrito = [...carrito];
    const platoExistente = nuevoCarrito.find(item => item.iD_Plato === plato.iD_Plato);

    if (platoExistente) {
      platoExistente.cantidad += 1;
      if (isPromotion) {
        platoExistente.isPromotion = true;
        platoExistente.precioConDescuento = (plato.precio_Referencia - (plato.precio_Referencia * plato.promocion.descuento / 100)).toFixed(2);
      }
    } else {
      const nuevoPlato = { ...plato, cantidad: 1 };
      if (isPromotion) {
        nuevoPlato.isPromotion = true;
        nuevoPlato.precioConDescuento = (plato.precio_Referencia - (plato.precio_Referencia * plato.promocion.descuento / 100)).toFixed(2);
      }
      nuevoCarrito.push(nuevoPlato);
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  return (
    <Router>
      {isAdmin ? (
        <AdminNavbar setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} carrito={carrito} />
      )}
      <div style={{ paddingTop: '60px' }}>
      <Routes>
  <Route path="/" element={<Inicio isLoggedIn={isLoggedIn} usuarioCompleto={usuarioCompleto} handleAddToCart={handleAddToCart} />} />
  <Route path="/Administrador" element={<Administrador setIsLoggedIn={setIsLoggedIn} />} />
  <Route path="/Sesion" element={<Sesion setIsLoggedIn={setIsLoggedIn} setUsuarioCompleto={setUsuarioCompleto} />} />
  <Route path="/Registro" element={<Registro setIsLoggedIn={setIsLoggedIn} setUsuarioCompleto={setUsuarioCompleto} />} />
  <Route path="/Editar" element={<Editar />} />
  <Route path="/Listar" element={<Listar />} />
  <Route path="/Cliente" element={<Cliente setUsuarioCompleto={setUsuarioCompleto} />} />
  <Route path="/carrito" element={<Carrito carrito={carrito} setCarrito={setCarrito} />} />
  <Route path="/pagos" element={<Pagos total={carrito.reduce((acc, plato) => acc + plato.precio_Referencia * plato.cantidad, 0)} />} />
  <Route path="/Procesando" element={<Procesando />} />
  <Route path="/Exitoso" element={<Exitoso />} />
  <Route path="/menu" element={<Menu isLoggedIn={isLoggedIn} handleAddToCart={handleAddToCart} />} />
  <Route path="/promotions" element={<Promotions handleAddToCart={handleAddToCart} />} />
  <Route path="/notificaciones" element={<Notificaciones />} />
  <Route path="/escribir-resena" element={<EscribirResena />} />
  <Route path="/MenuAdmin" element={<MenuAdmin setIsLoggedIn={setIsLoggedIn} />} />
  <Route path="/pedidos" element={<Pedidos />} />
  <Route path="/promociones" element={<Promociones />} />
  <Route path="/Editar-admin" element={<EditarAdmin />} />
  <Route path="/editar-plato/:id" element={<EditarPlato />} /> 
  <Route path="/notificacion-admin" element={<NotificacionAdmin />} /> 
</Routes>

      </div>
    </Router>
  );
};

export default App;
