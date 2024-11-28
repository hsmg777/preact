import React, { useState, useEffect } from "react";
import './styles/HistorialHoras.css';
import Navbar from "./NavBar";

const HistorialHoras = () => {
    const [platos, setPlatos] = useState([]);
    const [top3, setTop3] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPlato, setSelectedPlato] = useState("");

    const BASE_URL = "https://7e20-45-188-56-40.ngrok-free.app/api/registrotiempo/";

    const apiPlato = async () => {
        try {
            const response = await fetch("https://7e20-45-188-56-40.ngrok-free.app/api/plato/");
            if (!response.ok) {
                throw new Error("Error al obtener los platos");
            }
            const data = await response.json();
            setPlatos(data);
        } catch (error) {
            console.error("Error al consumir la API de platos:", error);
        }
    };

    const verTop3 = async (id_plato) => {
        try {
            const response = await fetch(`${BASE_URL}top3/${id_plato}`);
            if (!response.ok) throw new Error("Error al obtener el top 3 chefs más rápidos");
            const data = await response.json();
            setTop3(data);
            setSelectedPlato(platos.find(plato => plato.id_plato === id_plato)?.nombre || "Plato seleccionado");
            setModalVisible(true);
        } catch (error) {
            console.error("Error al obtener el top 3:", error);
        }
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setTop3([]);
    };

    useEffect(() => {
        apiPlato();
    }, []);

    return (
        <div className="mainHistoHoras">
            <Navbar />
            <div className="cabecera-historialHoras">
                <h1>Top Chefs más rápidos</h1>
            </div>
            <div className="cuerpo-historial">
                <div className="grid-menu-pedido">
                    {platos.map((plato) => (
                        <div
                            className="card-plato"
                            key={plato.id_plato}
                            onClick={() => verTop3(plato.id_plato)}
                        >
                            <img
                                src={plato.imagen || "https://via.placeholder.com/150"}
                                alt={plato.nombre}
                                className="imagen-plato"
                            />
                            <h3 className="nombre-plato">{plato.nombre}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Top 3 Chefs más rápidos - {selectedPlato}</h2>
                        <table className="tabla-top3">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Cédula</th>
                                    <th>Tiempo Total</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {top3.map((chef, index) => (
                                    <tr key={chef.id_registroTiempo}>
                                        <td>{index + 1}</td>
                                        <td>{chef.nombres}</td>
                                        <td>{chef.cedula}</td>
                                        <td>{chef.tiempoTotal}</td>
                                        <td>{chef.fecha}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="cerrar-modal" onClick={cerrarModal}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistorialHoras;
