import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; 
import './styles/Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [cedula, setCedula] = useState('');
    const [telefono, setTelefono] = useState('');
    const [isAdminis, setAdmin] = useState('');
    const [mensaje, setMensaje] = useState('');
    const history = useHistory();

    // URL base de la API expuesta por Ngrok
    const BASE_URL = "https://056d-2800-bf0-165-1282-e9e3-84b-e335-a3bb.ngrok-free.app/api/usuario";

    const volver = async () => {
        history.push({
            pathname: '/Menu',
            state: { logged: true }
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault(); 

        const nuevoUsuario = {
            Username: username,
            Contrasenia: contrasenia,
            Nombre: nombre,
            Apellido: apellido,
            Cedula: cedula,
            Telefono: telefono,
            isAdmin: isAdminis
        };

        try {
            const response = await fetch(`${BASE_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoUsuario),
            });

            if (response.status === 201) {
                setMensaje('Usuario registrado con éxito');
            } else if (response.status === 400) {
                setMensaje('El usuario ya existe');
            } else {
                setMensaje('Error al registrar el usuario');
            }
        } catch (error) {
            setMensaje('Hubo un error al comunicarse con el servidor');
        }
    };

    return (
        <div className='register-page'>
            <div className='register-encabezado'>
                <h1>PROYECTO CRUD USER</h1>
            </div>
            <div className='register-cuerpo'>
                <form className='register-form' onSubmit={handleRegister}>
                    <h2>BIENVENIDO</h2>
                    <p>Usuario:</p>
                    <input 
                        type='text' 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <p>Contraseña:</p>
                    <input 
                        type='password' 
                        value={contrasenia} 
                        onChange={(e) => setContrasenia(e.target.value)} 
                        required 
                    />
                    <p>Nombre:</p>
                    <input 
                        type='text' 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        required 
                    />
                    <p>Apellido :</p>
                    <input 
                        type='text' 
                        value={apellido} 
                        onChange={(e) => setApellido(e.target.value)} 
                        required 
                    />
                    <p>Cédula :</p>
                    <input 
                        type='text' 
                        value={cedula} 
                        onChange={(e) => setCedula(e.target.value)} 
                        required 
                    />
                    <p>Teléfono :</p>
                    <input 
                        type='text' 
                        value={telefono} 
                        onChange={(e) => setTelefono(e.target.value)} 
                        required 
                    />
                    <p>¿Es Admin? (Y/N):</p>
                    <input 
                        type='text' 
                        value={isAdminis} 
                        onChange={(e) => setAdmin(e.target.value)} 
                        required 
                    />

                    <button type="submit" className='reservar-button'>Crear</button>
                    <p>{mensaje}</p>
                    <button className='reservar-button' onClick={volver}>Regresar</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
