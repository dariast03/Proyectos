import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sesion.css';

const Sesion = ({ setIsLoggedIn, setUsuarioCompleto }) => {
    const [usuarioORemail, setUsuarioOrEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('https://51r87rnm-7263.brs.devtunnels.ms/api/Usuarios/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Nombre_Usuario: usuarioORemail,
                Email: usuarioORemail,
                Contrasena: contrasena
            }),
        });

        if (response.ok) {
            const usuariosResponse = await fetch('https://51r87rnm-7263.brs.devtunnels.ms/api/Usuarios/Listar');
            if (usuariosResponse.ok) {
                const usuarios = await usuariosResponse.json();
                const usuario = usuarios.find(u =>
                    (u.nombre_Usuario === usuarioORemail || u.email === usuarioORemail) &&
                    u.contrasena === contrasena
                );

                if (usuario) {
                    localStorage.setItem('usuarioId', usuario.iD_Usuario);
                    setIsLoggedIn(true);
                    checkCompletarPerfil(usuario.iD_Usuario, usuario.tipo_Usuario);
                } else {
                    alert('Error al encontrar el ID del usuario');
                }
            } else {
                alert('Error al listar los usuarios');
            }
        } else {
            alert('Error de inicio de sesión');
        }
    };

    const checkCompletarPerfil = async (userId, tipoUsuario) => {
        if (!userId) {
            console.error('No se ha proporcionado un ID de usuario');
            return;
        }

        const restaurantesResponse = await fetch('https://51r87rnm-7263.brs.devtunnels.ms/api/Restaurantes/Listar');
        if (restaurantesResponse.ok) {
            const restaurantes = await restaurantesResponse.json();
            const restaurante = restaurantes.find(r => r.iD_Usuario === userId);

            if (restaurante) {
                localStorage.setItem('restauranteId', restaurante.iD_Restaurante);
                setUsuarioCompleto(true);
                navigate('/Administrador');
                window.location.reload();
                return;
            }
        } else {
            alert('Error al listar los restaurantes');
            return;
        }


        const clientesResponse = await fetch('https://51r87rnm-7263.brs.devtunnels.ms/api/Clientes/Listar');
        if (clientesResponse.ok) {
            const clientes = await clientesResponse.json();
            const cliente = clientes.find(c => c.iD_Usuario === userId);

            if (cliente) {
                localStorage.setItem('clienteId', cliente.iD_Cliente);
                setUsuarioCompleto(true);
                navigate('/');
                window.location.reload();
                return;
            }
        } else {
            alert('Error al listar los clientes');
            return;
        }


        localStorage.removeItem('clienteId');
        localStorage.removeItem('restauranteId');
        navigate('/Cliente');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre de Usuario o Email:</label>
                <input
                    type="text"
                    value={usuarioORemail}
                    onChange={(e) => setUsuarioOrEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Contraseña:</label>
                <input
                    type="password"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default Sesion;
