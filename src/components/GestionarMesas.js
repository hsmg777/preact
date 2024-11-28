import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import "./styles/GestionarMesas.css";

const GestionarMesas = () => {
    const [mesas, setMesas] = useState([]);
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevaPassw, setNuevaPassw] = useState("");
    const [editandoId, setEditandoId] = useState(null);
    const [loading, setLoading] = useState(false);

    const BASE_URL = "http://127.0.0.1:5000/api/mesa";

    const listarMesas = async () => {
        setLoading(true);
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) throw new Error("Error al obtener las mesas");
            const data = await response.json();
            setMesas(data);
        } catch (error) {
            console.error("Error al listar mesas:", error);
            alert("Error al listar mesas. Intente más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const crearMesa = async () => {
        if (!nuevoNombre || !nuevaPassw) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        setLoading(true);
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
            alert("Error al crear la mesa. Intente más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const actualizarMesa = async () => {
        if (!editandoId || !nuevoNombre || !nuevaPassw) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        setLoading(true);
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
            alert("Error al actualizar la mesa. Intente más tarde.");
        } finally {
            setLoading(false);
        }
    };

    const eliminarMesa = async (id_mesa) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta mesa?")) {
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/${id_mesa}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Mesa eliminada con éxito.");
                listarMesas();
            } else {
                alert("Error al eliminar la mesa.");
            }
        } catch (error) {
            console.error("Error al eliminar mesa:", error);
            alert("Error al eliminar la mesa. Intente más tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        listarMesas();
    }, []);

    return (
        <div className="main-Gestion-Mesas">
            <NavBar />
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
                            <button
                                className="actualizar-mesas"
                                onClick={actualizarMesa}
                                disabled={loading}
                            >
                                Actualizar mesa
                            </button>
                        ) : (
                            <button
                                className="crear-mesas"
                                onClick={crearMesa}
                                disabled={loading}
                            >
                                Crear mesa
                            </button>
                        )}
                    </div>
                    {loading ? (
                        <p>Cargando...</p>
                    ) : mesas.length > 0 ? (
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
                                            <button
                                                onClick={() => {
                                                    setNuevoNombre(mesa.nombre);
                                                    setNuevaPassw(mesa.passw);
                                                    setEditandoId(mesa.id_mesa);
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button onClick={() => eliminarMesa(mesa.id_mesa)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay mesas disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GestionarMesas;
