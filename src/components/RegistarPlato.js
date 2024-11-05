import React, { useState, useEffect } from "react";
import './styles/RegistrarPlato.css';
import { useHistory } from "react-router-dom";

const RegistrarPlato = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [newPlato, setNewPlato] = useState({
        descripcion: "",
        urlImg: "",
        precio: 0,
        nombre: "",
        id_User: "",
    });
    const history = useHistory();
    const USERS_URL = "http://127.0.0.1:5000/api/usuario";
    const BASE_URL = "https://056d-2800-bf0-165-1282-e9e3-84b-e335-a3bb.ngrok-free.app/api/plato";

    // Función para listar usuarios administradores
    const listarUsuarios = async () => {
        try {
            const response = await fetch(USERS_URL);
            if (!response.ok) throw new Error("Error al listar usuarios");
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                const administradores = data.filter(user => user.isAdmin.trim() === "Y");
                setUsuarios(administradores);
            } else {
                console.error("La respuesta no es JSON.");
            }
        } catch (error) {
            console.error("Error al listar usuarios:", error);
            setMensaje("Error al listar usuarios.");
        }
    };

    useEffect(() => {
        listarUsuarios();
    }, []);

    // Función para registrar el nuevo plato
    const registrarPlato = async () => {
        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPlato),
                mode: 'cors',
                credentials: 'include', // Si usas cookies o autenticación basada en sesión
            });
            if (response.ok) {
                setMensaje("Plato registrado con éxito.");
                alert("Plato registrado con éxito.");
            } else {
                setMensaje("Error al registrar el plato.");
            }
        } catch (error) {
            console.error("Error al registrar plato:", error);
            setMensaje("Error al registrar plato.");
        }
    };
    
    

    // Maneja la carga de la imagen y la convierte en Base64
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPlato((prevState) => ({ ...prevState, urlImg: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Función para volver a la página anterior
    const volver = () => {
        history.push({
            pathname: "/gestionarPlatos",
            state: { logged: true },
        });
    };

    return (
        <div className="full-screen-container">
            <div className="form-container">
                <h2>Registrar Nuevo Plato</h2>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={newPlato.nombre}
                    onChange={(e) => setNewPlato({ ...newPlato, nombre: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={newPlato.precio}
                    onChange={(e) => setNewPlato({ ...newPlato, precio: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Descripción"
                    value={newPlato.descripcion}
                    onChange={(e) => setNewPlato({ ...newPlato, descripcion: e.target.value })}
                />
                <select
                    value={newPlato.id_User}
                    onChange={(e) => setNewPlato({ ...newPlato, id_User: e.target.value })}
                >
                    <option value="">Seleccionar Creador (Administrador)</option>
                    {usuarios.map((usuario) => (
                        <option key={usuario.id_User} value={usuario.id_User}>
                            {usuario.Nombre} {usuario.Apellido} (ID: {usuario.id_User})
                        </option>
                    ))}
                </select>
                <input type="file" accept="image/*" onChange={handleFileUpload} />
                <button onClick={registrarPlato}>Registrar</button>
                <button onClick={volver} className="close-button">Regresar</button>
                {mensaje && <p>{mensaje}</p>}
            </div>
        </div>
    );
};

export default RegistrarPlato;
