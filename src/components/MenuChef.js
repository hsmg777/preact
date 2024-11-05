import React, { useState, useEffect } from "react";
import './styles/MenuChef.css';

const MenuChef = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [ord, setOrd] = useState([]);
    const [temporaryStates, setTemporaryStates] = useState({});
    const [registroId, setRegistroId] = useState(null); // Guarda el ID del registro de horas
    const BASE_URL_DETALLES = "http://127.0.0.1:5000/api/orden/detalles";
    const BASE_URL_ORDEN = "http://127.0.0.1:5000/api/orden";
    const BASE_URL_REGISTRO_HORAS = "http://127.0.0.1:5000/api/registrohoras";

    // Función para listar las órdenes del endpoint /api/orden/detalles
    const listarOrdenes = async () => {
        try {
            const response = await fetch(BASE_URL_DETALLES);
            if (!response.ok) throw new Error("Error al obtener las órdenes");
            const data = await response.json();
            setOrdenes(data);
        } catch (error) {
            console.error("Error al listar órdenes:", error);
        }
    };

    // Función para listar las órdenes del endpoint /api/orden
    const listarOrd = async () => {
        try {
            const res = await fetch(BASE_URL_ORDEN);
            if (!res.ok) throw new Error("Error al obtener las órdenes");
            const data = await res.json();
            setOrd(data);
        } catch (error) {
            console.error("Error al listar ord:", error);
        }
    };

    // Función para manejar el cambio de estado temporal
    const handleEstadoChange = (id_orden, newEstado) => {
        setTemporaryStates((prevStates) => ({
            ...prevStates,
            [id_orden]: newEstado
        }));
    };

    // Función para actualizar la orden
    const actualizarOrden = async (orden) => {
        const matchedOrder = ord.find(o => o.id_orden === orden.id_orden);
        if (!matchedOrder) {
            alert("Orden no encontrada para actualizar.");
            return;
        }

        const newEstado = temporaryStates[orden.id_orden] || orden.Estado;

        try {
            const response = await fetch(`${BASE_URL_ORDEN}/${orden.id_orden}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cantidad: matchedOrder.cantidad,
                    id_plato: matchedOrder.id_plato,
                    id_mesa: matchedOrder.id_mesa,
                    observacion: orden.Observacion,
                    estado: newEstado,
                }),
            });

            if (response.ok) {
                alert("Orden actualizada con éxito.");
                setTemporaryStates((prevStates) => {
                    const { [orden.id_orden]: _, ...rest } = prevStates;
                    return rest;
                });
                listarOrdenes();
                listarOrd();
            } else {
                alert("Error al actualizar la orden.");
            }
        } catch (error) {
            console.error("Error al actualizar la orden:", error);
            alert("Error al actualizar la orden.");
        }
    };

    // Función para registrar la hora de ingreso (Clock-In)
    const registroIngreso = async () => {
        const now = new Date();
        const horaIngreso = now.toTimeString().split(' ')[0];
        const fecha = now.toISOString().split('T')[0];

        try {
            const response = await fetch(BASE_URL_REGISTRO_HORAS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    horaIngreso: horaIngreso,
                    fecha: fecha,
                    id_User: 1, // Reemplaza esto con el ID del usuario autenticado
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setRegistroId(data.id_registroHoras); // Guarda el ID del registro
                alert("Clock-In registrado con éxito.");
            } else {
                alert("Error al registrar Clock-In.");
            }
        } catch (error) {
            console.error("Error al registrar Clock-In:", error);
            alert("Error al registrar Clock-In.");
        }
    };

    // Función para registrar la hora de salida y calcular horas laboradas (Clock-Out)
    const registroSalida = async () => {
        if (!registroId) {
            alert("Primero debes hacer Clock-In.");
            return;
        }

        const now = new Date();
        const horaSalida = now.toTimeString().split(' ')[0];

        try {
            const response = await fetch(`${BASE_URL_REGISTRO_HORAS}/${registroId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    horaSalida: horaSalida,
                }),
            });

            if (response.ok) {
                alert("Clock-Out registrado con éxito.");
                setRegistroId(null); // Resetea el ID del registro
            } else {
                alert("Error al registrar Clock-Out.");
            }
        } catch (error) {
            console.error("Error al registrar Clock-Out:", error);
            alert("Error al registrar Clock-Out.");
        }
    };

    useEffect(() => {
        listarOrdenes();
        listarOrd();
    }, []);

    return (
        <div className="main-menu-chef">
            <div className="cabecera-menu-chef">
                <h1>Bienvenido</h1>
            </div>
            <div className="cuerpo-menu-chef">
                <div className="cuadrito-menu-chef">
                    <div className="registro-horas">
                        <button onClick={registroIngreso}>Clock-In</button>
                        <button onClick={registroSalida}>Clock-Out</button>
                        <button>Ver horas laboradas</button>
                    </div>
                    <div className="historial-pedidos">
                        <h2>Órdenes Pendientes</h2>
                        <table className="tabla-pedidos-chef">
                            <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>Mesa</td>
                                    <td>Plato</td>
                                    <td>Cantidad</td>
                                    <td>Observacion</td>
                                    <td>Estado</td>
                                    <td>Acciones</td>
                                </tr>
                            </thead>
                            <tbody>
                                {ordenes
                                    .filter((orden) => orden.Estado === "Pendiente")
                                    .map((orden) => (
                                        <tr key={orden.id_orden}>
                                            <td>{orden.id_orden}</td>
                                            <td>{orden.Mesa}</td>
                                            <td>{orden.Plato}</td>
                                            <td>{orden.Cantidad}</td>
                                            <td>{orden.Observacion}</td>
                                            <td>
                                                <select
                                                    value={temporaryStates[orden.id_orden] || orden.Estado}
                                                    onChange={(e) =>
                                                        handleEstadoChange(
                                                            orden.id_orden,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="Pendiente">Pendiente</option>
                                                    <option value="Completo">Completo</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        actualizarOrden(orden)
                                                    }
                                                >
                                                    Actualizar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuChef;
