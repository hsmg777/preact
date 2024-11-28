import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; 
import '../components/styles/MainPage.css';

const MainPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState(''); 
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const BASE_URL = "https://7e20-45-188-56-40.ngrok-free.app/api/usuario";
    const URL_MESA = "https://7e20-45-188-56-40.ngrok-free.app/api/mesa/validate";

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setMensaje('Por favor, complete todos los campos.');
            return;
        }

        setLoading(true);

        try {
            //validar al usuario
            const UserPsw = {
                username: username,
                contrasenia: password
            };

            const userResponse = await fetch(`${BASE_URL}/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(UserPsw),
            });

            if (userResponse.status === 200) {
                const userData = await userResponse.json();
                if (userData.valid) {
                    const isAdmin = userData.isAdmin?.trim();
                    if (isAdmin === "Y") {
                        alert("Bienvenido admin, acceso correcto");
                        history.push({ pathname: '/Menu', state: { logged: true } });
                        return;
                    } else if (isAdmin === "N") {
                        alert("Bienvenido usuario, acceso correcto");
                        history.push({ pathname: `/menuChef/${userData.id_User}`, state: { logged: true } });
                        return;
                    }
                }
            }

            // validar como mesa
            const MesaPsw = {
                nombre: username,
                passw: password
            };

            const mesaResponse = await fetch(URL_MESA, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(MesaPsw),
            });

            if (mesaResponse.status === 200) {
                const mesaData = await mesaResponse.json();
                if (mesaData.valid) {
                    alert("Bienvenido, acceso correcto como mesa.");
                    history.push({ pathname: `/menuUser/${mesaData.id_mesa}`, state: { logged: true } });
                    return;
                }
            }

            // Si ninguna validación es exitosa
            alert("Usuario o contraseña incorrectos, revise sus credenciales");
        } catch (error) {
            console.error("Error al comunicarse con el servidor:", error);
            alert("Hubo un error al comunicarse con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-page">
            <div className="encabezado">
                <h1>PROYECTO CRUD USER</h1>
            </div>
            <div className="cuerpo">
                <form className="form" onSubmit={handleLogin}>
                    <h2>BIENVENIDO</h2>
                    <h4>Ingrese su usuario</h4>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <h4>Ingrese su contraseña</h4>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit" className="reservar-button" disabled={loading}>
                        {loading ? "Accediendo..." : "Acceder"}
                    </button>
                    {mensaje && <p className="error-message">{mensaje}</p>}
                </form>
            </div>
        </div>
    );
};

export default MainPage;
