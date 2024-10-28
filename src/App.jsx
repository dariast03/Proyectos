import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navegacion';
import AdminNavbar from './components/AdminNav';
import Home from './pages/Inicio';
import HomeAdministrador from './pages/Administrador';
import Login from './pages/Login';
import Register from './pages/Register';
import CompletarPerfil from './pages/CompletarPerfil';
import EditarPerfil from './pages/EditarPerfil';
import VerPedidos from './pages/VerPedidos';
import Carrito from './pages/Carrito';
import Pagos from './pages/Pagos';
import ProcesandoPago from './pages/ProcesandoPago';
import PagoExitoso from './pages/PagoExitoso';
import Menu from './pages/Menu';
import Promotions from './pages/Promotions';
import Notificaciones from './pages/Notificaciones';
import EscribirResena from './pages/Resenas';
import MenuYPlatos from './pages/MenuYPlatos';
import Pedidos from './pages/Pedidos';
import Promociones from './pages/Promociones';
import EditarPerfilAdmin from './pages/EditarPerfilAdmin';
import EditarPlato from './pages/EditarPlato'; // Importa la nueva página de edición de plato

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
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} usuarioCompleto={usuarioCompleto} handleAddToCart={handleAddToCart} />} />
          <Route path="/home-administrador" element={<HomeAdministrador setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsuarioCompleto={setUsuarioCompleto} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} setUsuarioCompleto={setUsuarioCompleto} />} />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
          <Route path="/ver-pedidos" element={<VerPedidos />} />
          <Route path="/completar-perfil" element={<CompletarPerfil setUsuarioCompleto={setUsuarioCompleto} />} />
          <Route path="/carrito" element={<Carrito carrito={carrito} setCarrito={setCarrito} />} />
          <Route path="/pagos" element={<Pagos total={carrito.reduce((acc, plato) => acc + plato.precio_Referencia * plato.cantidad, 0)} />} />
          <Route path="/procesando-pago" element={<ProcesandoPago />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/menu" element={<Menu isLoggedIn={isLoggedIn} handleAddToCart={handleAddToCart} />} />
          <Route path="/promotions" element={<Promotions handleAddToCart={handleAddToCart} />} />
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/escribir-resena" element={<EscribirResena />} />
          <Route path="/menu-y-platos" element={<MenuYPlatos setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="/editar-perfil-admin" element={<EditarPerfilAdmin />} />
          <Route path="/editar-plato/:id" element={<EditarPlato />} /> {/* Nueva ruta para editar plato */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
