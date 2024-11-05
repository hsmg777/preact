import React, { useState, useEffect } from "react";
import NavBar from "./NavBar";
import './styles/GestionarMesas.css'
const GestionarMesas = () => {
    const [mesas, setMesas] = useState([]);
    const [nuevoNombre, setNuevoNombre] = useState("");

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
        if (!nuevoNombre) {
            alert("Por favor, ingrese un nombre para la mesa.");
            return;
        }

        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre: nuevoNombre }),
            });

            if (response.ok) {
                alert("Mesa creada con éxito.");
                setNuevoNombre(""); // Limpia el campo de entrada
                listarMesas(); // Actualiza la lista de mesas
            } else {
                alert("Error al crear la mesa.");
            }
        } catch (error) {
            console.error("Error al crear mesa:", error);
            alert("Error al crear la mesa.");
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
                            placeholder="Nombre de la nueva mesa"
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                        />
                        <button className="crear-mesas" onClick={crearMesa}>Crear mesa</button>
                    </div>
                    <table className="tabla-mesas">
                        <thead>
                            <tr>
                                <td>ID MESA</td>
                                <td>MESA</td>
                            </tr>
                        </thead>
                        <tbody>
                            {mesas.map((mesa) => (
                                <tr key={mesa.id_mesa}>
                                    <td>{mesa.id_mesa}</td>
                                    <td>{mesa.nombre}</td>
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
