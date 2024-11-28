import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import './styles/Menu.css';
import Navbar from './NavBar';

const Menu = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [idUsuario, setIdUsuario] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const BASE_URL = "http://api-flask-container.eastus2.azurecontainer.io:5000/api/usuario";

    const listarUsuarios = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/`);
            if (!response.ok) throw new Error("Error al listar usuarios.");
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            alert("Error al listar usuarios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listarUsuarios();
    }, []);

    const buscarUsuarioPorId = async () => {
        try {
            const response = await fetch(`${BASE_URL}/${idUsuario}`);
            if (!response.ok) throw new Error("Usuario no encontrado.");
            const data = await response.json();
            setUsuarios([data]);
            alert("Usuario encontrado.");
        } catch (error) {
            alert("Error al buscar usuario.");
        }
    };

    const actualizarUsuario = async (id_User, data) => {
        
        const payload = {
            Username: data.Username,
            Contrasenia: data.Contrasenia,
            Telefono: data.Telefono || "",
            Apellido: data.Apellido,
            Nombre: data.Nombre,
            isAdmin: data.isAdmin,
            Cedula: parseInt(data.Cedula, 10) || 0, 
        };
    
        
        if (!validarUsuario(payload)) return;
    
        try {
            const response = await fetch(`${BASE_URL}/${id_User}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload), 
            });
            if (response.ok) {
                
                setUsuarios((prevUsuarios) =>
                    prevUsuarios.map((u) =>
                        u.id_User === id_User ? { ...u, ...payload } : u
                    )
                );
                alert("Usuario actualizado con éxito.");
            } else {
                const errorData = await response.json();
                console.error("Error al actualizar usuario:", errorData);
                alert("Error al actualizar usuario.");
            }
        } catch (error) {
            console.error("Error en la solicitud PUT:", error);
            alert("Error en la solicitud PUT.");
        }
    };
    
    const eliminarUsuario = async (id_User) => {
        try {
            const response = await fetch(`${BASE_URL}/${id_User}`, { method: "DELETE" });
            if (response.ok) {
                setUsuarios((prevUsuarios) => prevUsuarios.filter((u) => u.id_User !== id_User));
                alert("Usuario eliminado con éxito.");
            } else {
                alert("Error al eliminar usuario.");
            }
        } catch (error) {
            alert("Error al eliminar usuario.");
        }
    };

    const validarUsuario = (usuario) => {
        if (!usuario.Username || !usuario.Contrasenia || !usuario.Nombre || !usuario.Apellido) {
            alert("Todos los campos son obligatorios.");
            return false;
        }
        if (!["Y", "N"].includes(usuario.isAdmin.trim())) {
            alert("El campo 'isAdmin' debe ser 'Y' o 'N'.");
            return false;
        }
        return true;
    };
    const handleRegistrar = () =>{
        history.push({ pathname: '/registrar', state: { logged: true } });
    }

    const handleInputChange = (id_User, e) => {
        const { name, value } = e.target;
        setUsuarios((prevUsuarios) =>
            prevUsuarios.map((usuario) =>
                usuario.id_User === id_User ? { ...usuario, [name]: value } : usuario
            )
        );
    };

    return (
        <div className="menu-page">
            <Navbar />
            <div className="cabeceraMenu">
                <h1>BIENVENIDO ADMINISTRADOR</h1>
                <h3>CRUD USUARIOS</h3>
            </div>
            <div className="cuadro">
                <div className="busqueda-barra">
                    <input
                        type="number"
                        placeholder="Ingresar ID"
                        value={idUsuario}
                        onChange={(e) => setIdUsuario(e.target.value)}
                    />
                    <button onClick={buscarUsuarioPorId}>Buscar</button>
                    <button onClick={listarUsuarios}>Listar Todos</button>
                    <button onClick={handleRegistrar}>Crear usuario</button>
                </div>
                {loading ? (
                    <div className="spinner">Cargando...</div>
                ) : (
                    <table className="tabla-usuarios">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Contraseña</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Teléfono</th>
                                <th>Cédula</th>
                                <th>is Admin?</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.length > 0 ? (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.id_User}>
                                        <td>
                                            <input
                                                type="text"
                                                name="Username"
                                                value={usuario.Username}
                                                onChange={(e) =>
                                                    handleInputChange(usuario.id_User, e)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="password"
                                                name="Contrasenia"
                                                value={usuario.Contrasenia}
                                                onChange={(e) =>
                                                    handleInputChange(usuario.id_User, e)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="Nombre"
                                                value={usuario.Nombre}
                                                onChange={(e) =>
                                                    handleInputChange(usuario.id_User, e)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="Apellido"
                                                value={usuario.Apellido}
                                                onChange={(e) =>
                                                    handleInputChange(usuario.id_User, e)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="Telefono"
                                                value={usuario.Telefono}
                                                onChange={(e) =>
                                                    handleInputChange(usuario.id_User, e)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="Cedula"
                                                value={usuario.Cedula}
                                                onChange={(e) =>
                                                    handleInputChange(usuario.id_User, e)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="isAdmin"
                                                value={usuario.isAdmin}
                                                onChange={(e) =>
                                                    handleInputChange(usuario.id_User, e)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    actualizarUsuario(usuario.id_User, usuario)
                                                }
                                            >
                                                Actualizar
                                            </button>
                                            <button
                                                onClick={() => eliminarUsuario(usuario.id_User)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">No hay usuarios disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Menu;
