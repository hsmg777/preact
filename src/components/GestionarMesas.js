import React, { useState, useEffect } from "react"; 
import NavBar from "./NavBar";
import './styles/GestionarMesas.css';

const GestionarMesas = () => {
    const [mesas, setMesas] = useState([]);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevaPassw, setNuevaPassw] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    const BASE_URL = "http://127.0.0.1:5000/api/mesa";

    const listarMesas = async () => {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) throw new Error("Error al obtener las mesas");
            const data = await response.json();
            console.log(data);
            setMesas(data);
        } catch (error) {
            console.error("Error al listar mesas:", error);
        }
    };

    const crearMesa = async () => {
        if (!nuevoNombre || !nuevaPassw) {
            alert("Por favor, ingrese un nombre y una contraseña para la mesa.");
            return;
        }
    
        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre: nuevoNombre, passw: nuevaPassw }),
            });
    
            if (response.ok) {
                alert("Mesa creada con éxito.");
                setNuevoNombre("");
                setNuevaPassw("");
                listarMesas();
            } else {
                alert("Error al crear la mesa.");
            }
        } catch (error) {
            console.error("Error al crear mesa:", error);
            alert("Error al crear la mesa.");
        }
    };

    const actualizarMesa = async () => {
        if (!editandoId || !nuevoNombre || !nuevaPassw) {
            alert("Por favor, complete los datos de la mesa a actualizar.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/${editandoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre: nuevoNombre, passw: nuevaPassw }),
            });

            if (response.ok) {
                alert("Mesa actualizada con éxito.");
                setNuevoNombre("");
                setNuevaPassw("");
                setEditandoId(null);
                listarMesas();
            } else {
                alert("Error al actualizar la mesa.");
            }
        } catch (error) {
            console.error("Error al actualizar mesa:", error);
            alert("Error al actualizar la mesa.");
        }
    };

    const eliminarMesa = async (id_mesa) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta mesa?");
        if (!confirmacion) return;

        try {
            const response = await fetch(`${BASE_URL}/${id_mesa}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("Mesa eliminada con éxito.");
                listarMesas();
            } else {
                alert("Error al eliminar la mesa.");
            }
        } catch (error) {
            console.error("Error al eliminar mesa:", error);
            alert("Error al eliminar la mesa.");
        }
    };

    useEffect(() => {
        listarMesas();
    }, []);

    return (
        <div className="main-Gestion-Mesas">
            <NavBar/>
            <div className="cabecera-gestion-mesas">
                <h1>GESTIONAR MESAS</h1>
            </div>
            <div className="cuerpo-gestion-mesas">
                <div className="cuadro-mesas">
                    <div className="barra-mesas">
                        <input
                            type="text"
                            placeholder="Nombre de la mesa"
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Contraseña de la mesa"
                            value={nuevaPassw}
                            onChange={(e) => setNuevaPassw(e.target.value)}
                        />
                        {editandoId ? (
                            <button className="actualizar-mesas" onClick={actualizarMesa}>Actualizar mesa</button>
                        ) : (
                            <button className="crear-mesas" onClick={crearMesa}>Crear mesa</button>
                        )}
                    </div>
                    <table className="tabla-mesas">
                        <thead>
                            <tr>
                                <td>ID MESA</td>
                                <td>MESA</td>
                                <td>ACCIONES</td>
                            </tr>
                        </thead>
                        <tbody>
                            {mesas.map((mesa) => (
                                <tr key={mesa.id_mesa}>
                                    <td>{mesa.id_mesa}</td>
                                    <td>{mesa.nombre}</td>
                                    <td>
                                        <button onClick={() => {
                                            setNuevoNombre(mesa.nombre);
                                            setNuevaPassw(mesa.passw); // Assuming `passw` is returned by API
                                            setEditandoId(mesa.id_mesa);
                                        }}>Editar</button>
                                        <button onClick={() => eliminarMesa(mesa.id_mesa)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GestionarMesas;
