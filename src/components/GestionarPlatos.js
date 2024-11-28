import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Navbar from "./NavBar";
import "./styles/GestionarPlato.css";

const GestionarPlatos = () => {
    const [platos, setPlatos] = useState([]);
    const [idPlato, setIdPlato] = useState("");
    const [mensaje, setMensaje] = useState("");
    const history = useHistory();

    const BASE_URL = "http://api-flask-container.eastus2.azurecontainer.io:5000/api/plato";

    // Función para listar platos
    const listarPlatos = async () => {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) throw new Error("Error al listar platos");
            const data = await response.json();

            // Mapea los datos de la respuesta para que coincidan con los nombres de propiedades en React
            const mappedData = data.map((plato) => ({
                id_plato: plato.id_plato,
                nombre: plato.nombre,
                precio: plato.precio,
                descripcion: plato.descripcion,
                urlImg: plato.imagen,
                creador: plato.creador,
                id_User: plato.id_User, // Incluye id_User para poder usarlo en PUT
            }));
            
            setPlatos(mappedData);
        } catch (error) {
            console.error("Error al listar platos:", error);
        }
    };

    useEffect(() => {
        listarPlatos();
    }, []);

    const buscarPlatoPorId = async () => {
        try {
            const response = await fetch(`${BASE_URL}/${idPlato}`);
            if (!response.ok) {
                setMensaje("Plato no encontrado.");
                setPlatos([]);
                return;
            }
            const data = await response.json();
            const mappedData = {
                id_plato: data.id_plato,
                nombre: data.nombre,
                precio: data.precio,
                descripcion: data.descripcion,
                urlImg: data.imagen,
                creador: data.creador,
                id_User: data.id_User,
            };
            setPlatos([mappedData]);
            setMensaje("");
        } catch (error) {
            console.error("Error al buscar platos:", error);
            setMensaje("Error al buscar plato.");
        }
    };

    const actualizarPlato = async (id_plato, data) => {
        try {
            const response = await fetch(`${BASE_URL}/${id_plato}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert("Plato actualizado con éxito");
                listarPlatos();
            } else {
                const errorData = await response.json();
                console.error("Error al actualizar el plato:", errorData);
                setMensaje(`Error al actualizar el plato: ${errorData.errors?.json || 'Revisa los datos enviados'}`);
            }
        } catch (error) {
            console.error("Error en la solicitud PUT:", error);
            setMensaje("Error en la solicitud PUT.");
        }
    };

    const eliminarPlato = async (id_plato) => {
        try {
            const response = await fetch(`${BASE_URL}/${id_plato}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setMensaje("Plato eliminado con éxito.");
                listarPlatos();
            } else {
                setMensaje("Error al eliminar plato.");
            }
        } catch (error) {
            console.error("Error al eliminar plato", error);
            setMensaje("Error al eliminar plato.");
        }
    };

    const handleInputChange = (id_plato, e) => {
        const { name, value } = e.target;
        setPlatos((prevPlatos) =>
            prevPlatos.map((plato) =>
                plato.id_plato === id_plato ? { ...plato, [name]: value } : plato
            )
        );
    };

    const irCrearplato = () => {
        history.push({
            pathname: "/registrarPlato",
            state: { logged: true },
        });
    };

    return (
        <div className="mainGestionPlatos">
            <Navbar />
            <div className="cabecera">
                <h1>GESTIONAR MENU</h1>
            </div>
            <div className="cuerpo">
                <div className="cuadro-plato">
                    <div className="busqueda-barra-plato">
                        <input
                            type="number"
                            placeholder="Ingresar ID"
                            value={idPlato}
                            onChange={(e) => setIdPlato(e.target.value)}
                        />
                        <button onClick={buscarPlatoPorId}>Buscar</button>
                        <button onClick={listarPlatos}>Listar Todos</button>
                        <button onClick={irCrearplato}>Crear Plato</button>
                    </div>
                    <table className="tabla-platos">
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>CREADOR</td>
                                <td>NOMBRE</td>
                                <td>PRECIO</td>
                                <td>DESCRIPCION</td>
                                <td>IMAGEN</td>
                                <td>ACCIONES</td>
                            </tr>
                        </thead>
                        <tbody>
                            {platos.map((plato) => (
                                <tr key={plato.id_plato}>
                                    <td>{plato.id_plato}</td>
                                    <td>{plato.creador}</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={plato.nombre || ""}
                                            onChange={(e) => handleInputChange(plato.id_plato, e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="precio"
                                            value={plato.precio || ""}
                                            onChange={(e) => handleInputChange(plato.id_plato, e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="descripcion"
                                            value={plato.descripcion || ""}
                                            onChange={(e) => handleInputChange(plato.id_plato, e)}
                                        />
                                    </td>
                                    <td>
                                        <img
                                            src={
                                                plato.urlImg && plato.urlImg.startsWith("http")
                                                    ? plato.urlImg
                                                    : plato.urlImg
                                                    ? `http://127.0.0.1:5000${plato.urlImg}`
                                                    : "https://via.placeholder.com/50" // URL de imagen de respaldo si urlImg está vacío o no es válida
                                            }
                                            alt="Plato"
                                            width="50"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }} // URL de respaldo en caso de error de carga
                                        />
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                const data = {
                                                    descripcion: plato.descripcion,
                                                    precio: parseFloat(plato.precio),
                                                    urlImg: plato.urlImg,
                                                    nombre: plato.nombre,
                                                    id_User: plato.id_User,
                                                };
                                                actualizarPlato(plato.id_plato, data);
                                            }}
                                        >
                                            Actualizar
                                        </button>
                                        <button onClick={() => eliminarPlato(plato.id_plato)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>
            {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
    );
};

export default GestionarPlatos;
