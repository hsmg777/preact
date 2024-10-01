import React from 'react';
import { Link } from 'react-router-dom'; // Si usas react-router-dom
import './styles/Register.css'

const Register = () => {
    return (
        <div className='register-page'>
            <div className='register-encabezado'>
                <h1>PROYECTO CRUD USER</h1>
            </div>
            <div className='register-cuerpo'>
                <div className='register-form'>
                    <h2>BIENVENIDO</h2>
                    <p>Usuario:</p>
                    <input type='text'></input>
                    <p>Constraseña:</p>
                    <input type='password'></input>
                    <p>Nombre:</p>
                    <input type='text'></input>
                    <p>Apellido :</p>
                    <input type='text'></input>
                    <p>Cedula :</p>
                    <input type='text'></input>
                    <p>Telefono :</p>
                    <input type='text'></input>
                    <button type="submit" className='reservar-button'>Crear</button>
                    <p>Tienes tu usuario? <Link to="/">Ingresa</Link> </p>
                </div>
            </div>
        </div>
    );
}
export default Register;