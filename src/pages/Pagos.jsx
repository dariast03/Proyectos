import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pagos.css';

const Pagos = ({ total }) => {
  const [tipoPago, setTipoPago] = useState('Efectivo');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [cvv, setCvv] = useState('');
  const navigate = useNavigate();

  const handlePago = () => {
    const clienteId = localStorage.getItem('clienteId');
    const descripcionPago = tipoPago === 'Efectivo' ? 'Efectivo' : `Tarjeta: ${numeroTarjeta}, Exp: ${fechaExpiracion}, CVV: ${cvv}`;
    navigate('/procesando-pago', { state: { total, tipoPago, descripcionPago, clienteId } });
  };

  return (
    <div className="pagos">
      <h1>Proceder al Pago</h1>
      <p>Total a pagar: {total} Bs</p>
      <div className="form-group">
        <label htmlFor="tipoPago">Tipo de Pago:</label>
        <select id="tipoPago" value={tipoPago} onChange={(e) => setTipoPago(e.target.value)}>
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
        </select>
      </div>
      {tipoPago === 'Tarjeta' && (
        <div className="tarjeta-info">
          <div className="form-group">
            <label htmlFor="numeroTarjeta">Número de Tarjeta:</label>
            <input
              type="text"
              id="numeroTarjeta"
              value={numeroTarjeta}
              onChange={(e) => setNumeroTarjeta(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fechaExpiracion">Fecha de Expiración:</label>
            <input
              type="text"
              id="fechaExpiracion"
              value={fechaExpiracion}
              onChange={(e) => setFechaExpiracion(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV:</label>
            <input
              type="text"
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </div>
        </div>
      )}
      <button className="pago-button" onClick={handlePago}>Realizar Pago</button>
    </div>
  );
};

export default Pagos;
