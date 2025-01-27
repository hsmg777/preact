import React, { useState, useEffect } from "react";
import Navbar from './NavBar';
import './styles/Maslentos.css';

const Lentos = () => {
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [ordenes, setOrdenes] = useState([]);
    const [promedios, setPromedios] = useState([]);
    const [resultadosFiltrados, setResultadosFiltrados] = useState([]);

    const obtenerNombrePlato = (idPlato) => {
        const nombresPlatos = {
            1: "Pizza",
            2: "Guesa",
            3: "Lasagna",
            4: "Risotto",
        };
        return nombresPlatos[idPlato] || "Desconocido";
    };

    const consultarAPIs = async () => {
        try {
            // API de órdenes lentas
            const ordenesResponse = await fetch("http://localhost:5000/api/registrotiempo/ordeneslentas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin,
                }),
            });

            if (!ordenesResponse.ok) {
                throw new Error("Error al obtener las órdenes lentas");
            }

            const ordenesData = await ordenesResponse.json();

            // API de tiempos promedio
            const promediosResponse = await fetch("http://localhost:5000/api/registrotiempo/tiempopromedio");

            if (!promediosResponse.ok) {
                throw new Error("Error al obtener los tiempos promedio");
            }

            const promediosData = await promediosResponse.json();

            
            setOrdenes(ordenesData);
            setPromedios(promediosData);

            //Comparacion
            const filtrados = ordenesData.filter((orden) => {
                const promedio = promediosData.find((p) => p.id_plato === orden.id_plato);
                return promedio && parseInt(orden.TiempoMaximo.split(":").reduce((acc, time) => (60 * acc) + +time, 0)) > promedio.TiempoPromedioSegundos;
            });

            setResultadosFiltrados(filtrados);
        } catch (error) {
            console.error("Error al consumir las APIs:", error.message);
        }
    };

    return (
        <div className="main-lentos">
            <Navbar />
            <div className="head-lentos">
                <h1>Ordenes lentas</h1>
            </div>
            <div className="cuerpo-lentos">
                <div className="inputs-lentos">
                    <p>Seleccionar fecha inicio:</p>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                    <p>Seleccionar fecha fin:</p>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>
                <button className="lentos-button" onClick={consultarAPIs}>
                    Consultar
                </button>
            </div>
            <div className="resultados-promedios">
                <h3>Tiempos Esperados</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID Plato</th>
                            <th>Nombre Plato</th>
                            <th>Tiempo Promedio (segundos)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promedios.length > 0 ? (
                            promedios.map((promedio) => (
                                <tr key={promedio.id_plato}>
                                    <td>{promedio.id_plato}</td>
                                    <td>{obtenerNombrePlato(promedio.id_plato)}</td>
                                    <td>{promedio.TiempoPromedioSegundos}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No se encontraron datos de tiempos promedio</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="resultados-lentos">
                <h3>Órdenes con tiempo mayor al promedio</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID Orden</th>
                            <th>ID Plato</th>
                            <th>Nombre Plato</th>
                            <th>Fecha Orden</th>
                            <th>Cantidad</th>
                            <th>Observación</th>
                            <th>Estado</th>
                            <th>Tiempo Máximo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultadosFiltrados.length > 0 ? (
                            resultadosFiltrados.map((orden) => (
                                <tr key={orden.id_orden}>
                                    <td>{orden.id_orden}</td>
                                    <td>{orden.id_plato}</td>
                                    <td>{obtenerNombrePlato(orden.id_plato)}</td>
                                    <td>{orden.FechaOrden}</td>
                                    <td>{orden.cantidad}</td>
                                    <td>{orden.observacion}</td>
                                    <td>{orden.estado}</td>
                                    <td>{orden.TiempoMaximo}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No se encontraron resultados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            
        </div>
    );
};

export default Lentos;
