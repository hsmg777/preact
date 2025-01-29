import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../components/styles/MainPage.css';
import DashboardFactory from './FactoryMethod/DashboardFactory';

const MainPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const history = useHistory(); // ✅ Para redirección

    const BASE_URL = "http://127.0.0.1:5000/api/usuario";
    const URL_MESA = "http://127.0.0.1:5000/api/mesa/validate";

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setMensaje("Por favor, complete todos los campos.");
            return;
        }

        setLoading(true);

        try {
            const UserPsw = { username, contrasenia: password };

            const userResponse = await fetch(`${BASE_URL}/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(UserPsw),
            });

            if (userResponse.status === 200) {
                const userData = await userResponse.json();
                if (userData.valid) {
                    alert("Acceso correcto");
                    const redirectPath = DashboardFactory.getDashboard(userData.isAdmin.trim(), userData.id_User, null);

                    if (redirectPath) {
                        console.log("Redirigiendo a:", redirectPath); // 🔍 DEBUG
                        history.push(redirectPath); // ✅ Redirigir inmediatamente
                        return;
                    }
                }
            }

            const MesaPsw = { nombre: username, passw: password };

            const mesaResponse = await fetch(URL_MESA, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(MesaPsw),
            });

            if (mesaResponse.status === 200) {
                const mesaData = await mesaResponse.json();
                if (mesaData.valid) {
                    alert("Acceso correcto");
                    const redirectPath = DashboardFactory.getDashboard(null, null, mesaData.id_mesa);

                    if (redirectPath) {
                        console.log("Redirigiendo a:", redirectPath); // 🔍 DEBUG
                        history.push(redirectPath); // ✅ Redirigir inmediatamente
                        return;
                    }
                }
            }

            setMensaje("Usuario o contraseña incorrectos, revise sus credenciales");
        } catch (error) {
            console.error("Error al comunicarse con el servidor:", error);
            setMensaje("Hubo un error al comunicarse con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-page">
            <div className="encabezado">
                <h1></h1>
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
