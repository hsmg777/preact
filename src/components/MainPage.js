import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; 
import '../components/styles/MainPage.css';

const MainPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState(''); 

    const handleLogin = async (e) => {
        e.preventDefault();

        const UserPsw = {
            username: username,
            contrasenia: password  
        };

        try {
            const response = await fetch('/api/usuario/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(UserPsw)
            });

            const data = await response.json();

            if (response.status === 200 && data.valid) {
                alert('Bienvenido, acceso correcto');
                history.push({
                    pathname: '/Menu',
                    state: { logged: true }
                  });
            } else {
                setMensaje('Usuario o contraseña incorrectos, revise sus credenciales');
            }
        } catch (error) {
            setMensaje('Hubo un error al comunicarse con el servidor');
        }
    }

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
