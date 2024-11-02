import React, { useState, useEffect } from "react";
import './styles/HistorialHoras.css';
import Navbar from "./NavBar";

const HistorialHoras = () => {
    const [historial, setHistorial] = useState([]);
    const [fecha, setFecha] = useState("");
    const BASE_URL = "https://0d45-2800-bf0-165-1282-f479-31e-8559-5b93.ngrok-free.app/api/registrohoras";

    const listarHistorial = async () => {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) throw new Error("Error al obtener el historial");
            const data = await response.json();
            setHistorial(data);
        } catch (error) {
            console.error("Error al listar historial de horas:", error);
        }
    };

    const buscarHorasFecha = async () => {
        if (!fecha) return;
        try {
            const response = await fetch(`${BASE_URL}/filtrar_por_fecha?fecha=${fecha}`);
            if (!response.ok) throw new Error("Error al buscar horas por fecha");
            const data = await response.json();
            setHistorial(data);
        } catch (error) {
            console.error("Error al buscar historial de horas:", error);
        }
    };

    useEffect(() => {
        listarHistorial();
    }, []);

    return (
        <div className="mainHistoHoras">
            <Navbar/>
            <div className="cabecera-historialHoras">
                <h1> HORAS LABORADAS POR EMPLEADO </h1>
            </div>
            <div className="cuerpo-historial">
                <div className="cuadro">
                    <div className="busqueda-barra-horas">
                        <input
                            type="date"
                            placeholder="Seleccionar fecha"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                        />
                        <button onClick={buscarHorasFecha}>Buscar</button>
                        <button onClick={listarHistorial}>Listar Historial</button>
                    </div>
                    <table className="tabla-historial-horas">
                        <thead className="tabla-encabezado">
                            <tr>
                                <th className="tabla-header">Fecha</th>
                                <th className="tabla-header">Cédula</th>
                                <th className="tabla-header">Nombres</th>
                                <th className="tabla-header">Ingreso</th>
                                <th className="tabla-header">Salida</th>
                                <th className="tabla-header">Horas Laboradas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historial.map((registro) => (
                                <tr key={registro.id_registroHoras} className="tabla-fila">
                                    <td>{registro.fecha}</td>
                                    <td>{registro.cedula}</td>
                                    <td>{registro.nombres}</td>
                                    <td>{registro.horaIngreso}</td>
                                    <td>{registro.horaSalida}</td>
                                    <td>{registro.horasLaboradas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HistorialHoras;
