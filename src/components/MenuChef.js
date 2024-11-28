import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './styles/MenuChef.css';

const MenuChef = () => {
    const { id_User } = useParams();
    const [ordenes, setOrdenes] = useState([]);
    const [detallesOrdenes, setDetallesOrdenes] = useState([]);
    const [registroHoras, setRegistroHoras] = useState({});

    const BASE_URL_DETALLES = "http://api-flask-container.eastus2.azurecontainer.io:5000/api/orden/detalles";
    const BASE_URL_ORDEN = "http://api-flask-container.eastus2.azurecontainer.io:5000/api/orden/";
    const BASE_URL_REGISTRO_HORAS = "http://api-flask-container.eastus2.azurecontainer.io:5000/api/registrotiempo/";

    useEffect(() => {
        if (!id_User) {
            alert("No tienes permiso para acceder a esta página.");
        } else {
            cargarDatos();
        }
    }, [id_User]);

    const cargarDatos = async () => {
        try {
            const [responseDetalles, responseOrdenes] = await Promise.all([
                fetch(BASE_URL_DETALLES),
                fetch(BASE_URL_ORDEN),
            ]);

            if (!responseDetalles.ok || !responseOrdenes.ok) {
                throw new Error("Error al obtener datos de las APIs");
            }

            const dataDetalles = await responseDetalles.json();
            const dataOrdenes = await responseOrdenes.json();

            setDetallesOrdenes(dataDetalles);
            setOrdenes(dataOrdenes);
            console.log(detallesOrdenes);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    };

    const registrarInicio = async (orden) => {
        const now = new Date();
        const tiempoInicio = now.toTimeString().split(" ")[0];
        const fecha = now.toISOString().split("T")[0];

        // Buscar `id_plato` desde la lista de órdenes
        const ordenCompleta = ordenes.find((o) => o.id_orden === orden.id_orden);
        if (!ordenCompleta || !ordenCompleta.id_plato) {
            alert("No se encontró el plato asociado a esta orden.");
            return;
        }

        try {
            const response = await fetch(BASE_URL_REGISTRO_HORAS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_User: id_User,
                    id_plato: ordenCompleta.id_plato,
                    fecha: fecha,
                    tiempoInicio: tiempoInicio,
                    tiempoFin: null,
                    tiempoTotal: null,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setRegistroHoras((prevState) => ({
                    ...prevState,
                    [orden.id_orden]: data.id_registroTiempo,
                }));
                alert(`Inicio registrado para la orden ${orden.id_orden}`);
            } else {
                alert("Error al registrar el inicio.");
            }
        } catch (error) {
            console.error("Error al registrar el inicio:", error);
            alert("Error al registrar el inicio.");
        }
    };

    const registrarFin = async (orden) => {
        const now = new Date();
        const tiempoFin = now.toTimeString().split(" ")[0]; // Hora actual
    
        const registroId = registroHoras[orden.id_orden]; // Recuperar el id_registroHoras asociado
        if (!registroId) {
            alert("Debes registrar el inicio antes de registrar el fin.");
            return;
        }
    
        try {
            // Obtener el registro actual de la API
            const responseGet = await fetch(`${BASE_URL_REGISTRO_HORAS}${registroId}`);
            if (!responseGet.ok) {
                alert("Error al obtener el registro actual.");
                return;
            }
            const registroActual = await responseGet.json();
    
            // Calcular tiempo total
            const tiempoInicio = registroActual.tiempoInicio;
            const [horaInicioH, horaInicioM, horaInicioS] = tiempoInicio.split(":").map(Number);
            const [horaFinH, horaFinM, horaFinS] = tiempoFin.split(":").map(Number);
    
            const tiempoInicioDate = new Date();
            tiempoInicioDate.setHours(horaInicioH, horaInicioM, horaInicioS);
    
            const tiempoFinDate = new Date();
            tiempoFinDate.setHours(horaFinH, horaFinM, horaFinS);
    
            const diferenciaMs = tiempoFinDate - tiempoInicioDate; // Diferencia en milisegundos
            const tiempoTotal = new Date(diferenciaMs).toISOString().slice(11, 19); // Formato HH:MM:SS
    
            // JSON para actualizar el registro de tiempo
            const payloadRegistroTiempo = {
                id_User: registroActual.id_User,
                id_plato: registroActual.id_plato,
                fecha: registroActual.fecha,
                tiempoInicio: registroActual.tiempoInicio,
                tiempoFin: tiempoFin,
                tiempoTotal: tiempoTotal,
            };
    
            console.log("Payload enviado a /api/registrotiempo:", payloadRegistroTiempo);
    
            // Realizar el PUT para actualizar el registro de tiempo
            const responsePutRegistro = await fetch(`${BASE_URL_REGISTRO_HORAS}${registroId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payloadRegistroTiempo),
            });
    
            if (responsePutRegistro.ok) {
                // JSON para actualizar el estado de la orden
                const payloadOrden = {
                    estado: "Completo",
                    observacion: orden.Observacion || "Sin observación",
                    id_mesa: orden.id_mesa, 
                    cantidad: orden.Cantidad, 
                    id_plato: orden.id_plato || registroActual.id_plato, 
                };
    
                console.log("Payload enviado a /api/orden:", payloadOrden);
    
                // Realizar el PUT para cambiar el estado de la orden
                const responsePutOrden = await fetch(`${BASE_URL_ORDEN}${orden.id_orden}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payloadOrden),
                });
    
                if (responsePutOrden.ok) {
                    alert(`Orden ${orden.id_orden} completada con éxito.`);
                    cargarDatos(); // Actualizar la lista de datos
                } else {
                    const errorData = await responsePutOrden.json();
                    console.error("Error al actualizar el estado de la orden:", errorData);
                    alert("Error al cambiar el estado de la orden.");
                }
            } else {
                const errorDataRegistro = await responsePutRegistro.json();
                console.error("Error al actualizar el registro de tiempo:", errorDataRegistro);
                alert("Error al finalizar el registro de tiempo.");
            }
        } catch (error) {
            console.error("Error al registrar el fin:", error);
            alert("Error al registrar el fin.");
        }
    };
    
    
    
    return (
        <div className="main-menu-chef">
            <div className="cabecera-menu-chef">
                <h1>Bienvenido, Usuario {id_User}</h1>
            </div>
            <div className="cuerpo-menu-chef">
                <div className="historial-pedidos">
                    <h2>Órdenes Pendientes</h2>
                    <table className="tabla-pedidos-chef">
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>idMesa</td>
                                <td>Mesa</td>
                                <td>Plato</td>
                                <td>Cantidad</td>
                                <td>Observación</td>
                                <td>Estado</td>
                                <td>Acciones</td>
                            </tr>
                        </thead>
                        <tbody>
                            {detallesOrdenes
                                .filter((orden) => orden.Estado === "Pendiente")
                                .map((orden) => (
                                    <tr key={orden.id_orden}>
                                        <td>{orden.id_orden}</td>
                                        <td>{orden.id_mesa}</td>
                                        <td>{orden.Mesa}</td>
                                        <td>{orden.Plato}</td>
                                        <td>{orden.Cantidad}</td>
                                        <td>{orden.Observacion}</td>
                                        <td>{orden.Estado}</td>
                                        <td>
                                            <button onClick={() => registrarInicio(orden)}>Empezar</button>
                                            <button onClick={() => registrarFin(orden)}>Terminar</button>
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

export default MenuChef;
