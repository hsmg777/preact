import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import './styles/Menu.css';

const Menu = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [idUsuario, setIdUsuario] = useState("");
    const [mensaje, setMensaje] = useState("");
    const history = useHistory();

    // URL base de la API expuesta por Ngrok
    const BASE_URL = "http://127.0.0.1:5000/api/usuario";

    const listarUsuarios = async () => {
        try {
            const response = await fetch(`${BASE_URL}/`);
    
            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);
    
            const contentType = response.headers.get("content-type");
    
            // Verifica si el tipo de contenido es JSON
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                console.log("Data received:", data);
                setUsuarios(data);
                setMensaje("");
            } else {
                // Si la respuesta no es JSON, intenta leerla como texto para ver si contiene un mensaje de error
                const text = await response.text();
                console.error("La respuesta no es JSON. Respuesta recibida:", text);
                setMensaje("Error al listar usuarios. Verifica la API y CORS.");
            }
        } catch (error) {
            console.error("Error al listar usuarios:", error);
            setMensaje("Error al listar usuarios. Verifica la API y CORS.");
        }
    };
    
    

    useEffect(() => {
        listarUsuarios();
    }, []);

    const buscarUsuarioPorId = async () => {
        console.log("Buscando usuario con ID:", idUsuario); 
        try {
            const response = await fetch(`${BASE_URL}/${idUsuario}`);
            if (!response.ok) {
                setMensaje("Usuario no encontrado.");
                setUsuarios([]);
                return;
            }
            const data = await response.json();

            // Limpiar el campo isAdmin
            data.isAdmin = data.isAdmin ? data.isAdmin.trim() : null;
            
            setUsuarios([data]);
            setMensaje("");
        } catch (error) {
            console.error("Error al buscar usuario:", error);
            setMensaje("Error al buscar usuario.");
        }
    };

    const registrarUsuarios = () => {
        history.push({
            pathname: '/registrar',
            state: { logged: true }
        });
    };

    const actualizarUsuario = async (id_User, data) => {
        console.log("Actualizando usuario con ID:", id_User, "Datos:", data);
        try {
            const response = await fetch(`${BASE_URL}/${id_User}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert("Usuario actualizado con éxito");
                listarUsuarios(); // Refresca la lista después de actualizar
            } else {
                const errorData = await response.json();
                console.error('Error al actualizar el usuario:', errorData);
                setMensaje("Error al actualizar el usuario.");
            }
        } catch (error) {
            console.error('Error en la solicitud PUT:', error);
            setMensaje("Error en la solicitud PUT.");
        }
    };

    const eliminarUsuario = async (id_User) => {
        console.log("Eliminando usuario con ID:", id_User);
        if (!id_User) {
            console.error("ID de usuario no proporcionado");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/${id_User}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setMensaje("Usuario eliminado con éxito.");
                listarUsuarios();
            } else {
                setMensaje("Error al eliminar usuario.");
            }
        } catch (error) {
            console.error("Error al eliminar usuario", error);
            setMensaje("Error al eliminar usuario.");
        }
    };

    const handleInputChange = (id_User, e) => {
        const { name, value } = e.target;
        setUsuarios((prevUsuarios) =>
            prevUsuarios.map((u) => (u.id_User === id_User ? { ...u, [name]: value } : u))
        );
    };

    return (
        <div className="menu-page">
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
                    <button onClick={registrarUsuarios}>Crear usuario</button>
                </div>

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
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id_User}>
                                <td>
                                    <input
                                        type="text"
                                        name="Username"
                                        value={usuario.Username}
                                        onChange={(e) => handleInputChange(usuario.id_User, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="password"
                                        name="Contrasenia"
                                        value={usuario.Contrasenia}
                                        onChange={(e) => handleInputChange(usuario.id_User, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="Nombre"
                                        value={usuario.Nombre}
                                        onChange={(e) => handleInputChange(usuario.id_User, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="Apellido"
                                        value={usuario.Apellido}
                                        onChange={(e) => handleInputChange(usuario.id_User, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="Telefono"
                                        value={usuario.Telefono}
                                        onChange={(e) => handleInputChange(usuario.id_User, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="Cedula"
                                        value={usuario.Cedula}
                                        onChange={(e) => handleInputChange(usuario.id_User, e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        name="isAdmin?"
                                        value={usuario.isAdmin}
                                        onChange={(e) => handleInputChange(usuario.id_User, e)}
                                    />
                                </td>
                                <td>
                                    <button
                                        onClick={() =>
                                            actualizarUsuario(usuario.id_User, {
                                                Username: usuario.Username,
                                                Contrasenia: usuario.Contrasenia,
                                                Nombre: usuario.Nombre,
                                                Apellido: usuario.Apellido,
                                                Cedula: usuario.Cedula,
                                                Telefono: usuario.Telefono,
                                                isAdmin: usuario.isAdmin
                                            })
                                        }
                                    >
                                        Actualizar
                                    </button>
                                    <button onClick={() => eliminarUsuario(usuario.id_User)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {mensaje && <p className="mensaje">{mensaje}</p>}
            </div>
        </div>
    );
};

export default Menu;
