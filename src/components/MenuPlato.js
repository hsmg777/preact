import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Para capturar el id_mesa desde la URL
import "./styles/MenuPlatos.css";

const MenuPlato = () => {
    const [platos, setPlatos] = useState([]);
    const { id_User } = useParams(); // Captura el id_mesa de la URL

    const apiPlato = async () => {
        console.log(id_User);
        try {
            const response = await fetch("http://api-flask-container.eastus2.azurecontainer.io:5000/api/plato/");
            if (!response.ok) {
                throw new Error("Error al obtener los platos");
            }
            const data = await response.json();
            setPlatos(data);
        } catch (error) {
            console.error("Error al consumir la API de platos:", error);
        }
    };

    const pedirPlato = async (platoId) => {
        const inputObservacion = document.querySelector(`#observacion-${platoId}`);
        const inputCantidad = document.querySelector(`#cantidad-${platoId}`);

        const observacion = inputObservacion.value || "Sin observaciones";
        const cantidad = parseInt(inputCantidad.value) || 1;

        const payload = {
            id_mesa: parseInt(id_User, 10),
            observacion: observacion,
            cantidad: cantidad,
            id_plato: platoId,
            estado: "Pendiente",
        };
        console.log(payload);

        try {
            const response = await fetch("http://api-flask-container.eastus2.azurecontainer.io:5000/api/orden/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Pedido realizado con éxito");
                inputObservacion.value = ""; // Limpiar el input de observación
                inputCantidad.value = "1"; // Restablecer la cantidad a 1
            } else {
                throw new Error("Error al realizar el pedido");
            }
        } catch (error) {
            console.error("Error al realizar el pedido:", error);
            alert("Hubo un error al realizar el pedido");
        }
    };

    useEffect(() => {
        apiPlato();
    }, []);

    return (
        <div className="menuPlatos-page">
            <div className="titulo-pedido-page">
                <h1>Menú de Platos</h1>
            </div>
            <div className="grid-menu-pedido">
                {platos.map((plato) => (
                    <div className="card-plato" key={plato.id_plato}>
                        <img
                            src={plato.imagen || "https://via.placeholder.com/150"}
                            alt={plato.nombre}
                            className="imagen-plato"
                        />
                        <h3 className="nombre-plato">{plato.nombre}</h3>
                        <p className="precio-plato">${plato.precio.toFixed(2)}</p>
                        <div className="seccion-pedir">
                            <p>Observaciones:</p>
                            <input
                                type="text"
                                placeholder="Observaciones"
                                className="input-observaciones"
                                id={`observacion-${plato.id_plato}`}
                            />
                            <div className="cantidad-container">
                                <button
                                    className="boton-cantidad"
                                    onClick={() => {
                                        const inputCantidad = document.querySelector(`#cantidad-${plato.id_plato}`);
                                        const newValue = Math.max(parseInt(inputCantidad.value) - 1, 1);
                                        inputCantidad.value = newValue;
                                    }}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    id={`cantidad-${plato.id_plato}`}
                                    defaultValue="1"
                                    min="1"
                                    className="input-cantidad"
                                />
                                <button
                                    className="boton-cantidad"
                                    onClick={() => {
                                        const inputCantidad = document.querySelector(`#cantidad-${plato.id_plato}`);
                                        const newValue = parseInt(inputCantidad.value) + 1;
                                        inputCantidad.value = newValue;
                                    }}
                                >
                                    +
                                </button>
                            </div>
                            <button className="boton-pedir" onClick={() => pedirPlato(plato.id_plato)}>
                                Pedir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuPlato;
