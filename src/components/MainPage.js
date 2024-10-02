import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; 
import '../components/styles/MainPage.css';

const MainPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState(''); // Estado para el mensaje de error
    const history = useHistory(); // Hook para redireccionar

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/usuario', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const usuarios = await response.json();

                // Buscar si el username y la contraseña coinciden
                const usuarioValido = usuarios.find(user => 
                    user.Username === username && user.Contrasenia === password
                );

                if (usuarioValido) {
                    // Si el usuario es válido, redirigir a /menu
                    history.push('/menu');
                } else {
                    // Si no es válido, mostrar mensaje de error
                    setMensaje('Usuario o contraseña incorrectos. Por favor, revise sus credenciales.');
                }
            } else {
                setMensaje('Error al conectar con el servidor. Intente nuevamente.');
            }
        } catch (error) {
            setMensaje('Error de comunicación con el servidor.');
        }
    };

    return (
        <div className='main-page'>
            <div className='encabezado'>
                <h1>PROYECTO CRUD USER</h1>
            </div>
            <div className='cuerpo'>
                <form className='form' onSubmit={handleLogin}>
                    <h2>BIENVENIDO</h2>
                    <h4>Ingrese su usuario</h4>
                    <input 
                        type='text' 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <h4>Ingrese su contraseña</h4>
                    <input 
                        type='password' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" className='reservar-button'>Acceder</button>
                    {mensaje && <p style={{ color: 'red' }}>{mensaje}</p>}
                    <p>No tienes tu usuario? <Link to="/registrar">Regístrate</Link> </p> 
                </form>
            </div>
        </div>
    );
};

export default MainPage;
