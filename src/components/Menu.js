import React, { useState, useEffect } from "react";
import './styles/Menu.css';

const Menu = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [idUsuario, setIdUsuario] = useState("");
    const [mensaje, setMensaje] = useState("");

    // Listar todos los usuarios
    const listarUsuarios = async () => {
        try {
            const response = await fetch("/api/usuario/");
            const data = await response.json();
            setUsuarios(data);
            setMensaje("");
        } catch (error) {
            console.error("Error al listar usuarios", error);
        }
    };

    useEffect(() => {
        listarUsuarios(); 
    }, []);

    // Buscar usuario por ID
    const buscarUsuarioPorId = async () => {
        try {
            const response = await fetch(`/api/usuario/${idUsuario}`);
            if (response.ok) {
                const data = await response.json();
                setUsuarios([data]); // Mostrar solo el usuario buscado
                setMensaje("");
            } else {
                setMensaje("Usuario no encontrado.");
                setUsuarios([]); // Limpiar lista si no se encuentra el usuario
            }
        } catch (error) {
            console.error("Error al buscar usuario", error);
            setMensaje("Error al buscar usuario.");
        }
    };

    //Actualizar Usuario
    const actualizarUsuario = async (id_User, data) => {
        try {
          const response = await fetch(`http://localhost:3000/api/usuario/${id_User}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al actualizar el usuario:', errorData);
          } else {
            alert("Usuario actualizado con exito")
            console.log('Usuario actualizado con éxito');
          }
        } catch (error) {
          console.error('Error en la solicitud PUT:', error);
        }
      };
      

    // Eliminar usuario
    const eliminarUsuario = async (id_User) => {
        try {
            const response = await fetch(`/api/usuario/${id_User}`, {
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

    // Manejar cambio en los inputs de los usuarios
    const handleInputChange = (id_User, e) => {
        const { name, value } = e.target;
        setUsuarios(usuarios.map((u) => (u.id_User === id_User ? { ...u, [name]: value } : u)));
    };

    return (
        <div className="menu-page">
            <div className="cabeceraMenu">
                <h1>BIENVENIDO</h1>
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
                                <button
                                    onClick={() => actualizarUsuario(usuario.id_User, {
                                        Username: usuario.Username,
                                        Contrasenia: usuario.Contrasenia,
                                        Nombre: usuario.Nombre,
                                        Apellido: usuario.Apellido,
                                        Cedula: usuario.Cedula,
                                        Telefono: usuario.Telefono,
                                    })}
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
