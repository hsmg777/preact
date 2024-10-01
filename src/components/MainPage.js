import React from 'react';
import { Link } from 'react-router-dom'; // Si usas react-router-dom
import '../components/styles/MainPage.css'

const MainPage = () => {
    return (
        <div className='main-page'>
            <div className='encabezado'>
                <h1>PROYECTO CRUD USER</h1>
            </div>
            <div className='cuerpo'>
                <div className='form'>
                    <h2>BIENVENIDO</h2>
                    <h4>Ingrese su usuario</h4>
                    <input type='text'></input>
                    <h4>Ingrese su contraseña</h4>
                    <input type='password'></input>
                    <button type="submit" className='reservar-button'>Acceder</button>
                    <p>No tienes tu usuario? <Link to="/registrar">Registrate</Link> </p> {/* Usando Link */}
                </div>
            </div>
        </div>
    );
}

export default MainPage;
