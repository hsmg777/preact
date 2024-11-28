import React, { useState, useEffect } from "react";
import './styles/RegistrarPlato.css';
import { useHistory } from "react-router-dom";

const RegistrarPlato = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);
    const [newPlato, setNewPlato] = useState({
        descripcion: "",
        urlImg: "",
        precio: 0,
        nombre: "",
        id_User: "",
    });
    const history = useHistory();
    const USERS_URL = "http://api-flask-container.eastus2.azurecontainer.io:5000/api/usuario";
    const BASE_URL = "http://api-flask-container.eastus2.azurecontainer.io:5000/api/plato/";

    const listarUsuarios = async () => {
        setLoading(true);
        try {
            const response = await fetch(USERS_URL);
            if (!response.ok) throw new Error("Error al listar usuarios");
            const data = await response.json();
            const administradores = data.filter(user => user.isAdmin.trim() === "Y");
            setUsuarios(administradores);
        } catch (error) {
            console.error("Error al listar usuarios:", error);
            alert("Error al listar usuarios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listarUsuarios();
    }, []);

    const validarFormulario = () => {
        if (!newPlato.nombre || !newPlato.precio || !newPlato.descripcion || !newPlato.id_User) {
            alert("Por favor, completa todos los campos.");
            return false;
        }
        if (newPlato.precio <= 0) {
            alert("El precio debe ser mayor a 0.");
            return false;
        }
        return true;
    };

    const registrarPlato = async () => {
        if (!validarFormulario()) return;

        setLoading(true);
        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPlato),
            });
            if (response.ok) {
                alert("Plato registrado con éxito.");
                setNewPlato({ descripcion: "", urlImg: "", precio: 0, nombre: "", id_User: "" });
            } else {
                alert("Error al registrar el plato.");
            }
        } catch (error) {
            console.error("Error al registrar plato:", error);
            alert("Error al registrar plato.");
        } finally {
            setLoading(false);
        }
    };

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

    const volver = () => {
        history.push({
            pathname: '/gestionarPlatos',
            state: { logged: true }
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
                {loading ? <div className="spinner">Cargando...</div> : null}
                <button onClick={registrarPlato} disabled={loading}>Registrar</button>
                <button onClick={volver} className="close-button">Regresar</button>
            </div>
        </div>
    );
};

export default RegistrarPlato;
