import React, { useState, useEffect } from 'react';
import Navbar from './NavBar';
import './styles/HistorialOrdenes.css'
const HistorialOrdenes = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [error, setError] = useState(null);

    const listarOrdenes = async () => {
        try {
            const response = await fetch("http://api-flask-container.eastus2.azurecontainer.io:5000/api/orden/detalles");
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            const data = await response.json();
            console.log("Data received:", data);
            setOrdenes(data);
        } catch (error) {
            console.error("Error al listar ordenes:", error);
            setError("No se pudieron cargar las órdenes. Por favor, intente más tarde.");
        }
    };

    useEffect(() => {
        listarOrdenes();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    return (
        <div className='mainHistorial'>
            <Navbar />
            <div className='title'>
                <h1>Historial de Ordenes</h1>
            </div>
            <div className='table-view-order'>
                {error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <table className='tabla-ordenes'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>MESA</th>
                                <th>PLATO</th>
                                <th>CANTIDAD</th>
                                <th>OBSERVACION</th>
                                <th>FECHA</th>
                                <th>ESTADO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenes.map((orden) => (
                                <tr key={orden.id_orden}>
                                    <td>{orden.id_orden}</td>
                                    <td>{orden.Mesa}</td>  {/* Cambiado a minúscula */}
                                    <td>{orden.Plato}</td>  {/* Cambiado a minúscula */}
                                    <td>{orden.Cantidad}</td>  {/* Cambiado a minúscula */}
                                    <td>{orden.Observacion}</td>  {/* Cambiado a minúscula */}
                                    <td>{formatDate(orden.Fecha)}</td>  {/* Cambiado a minúscula */}
                                    <td>{orden.Estado}</td>  {/* Cambiado a minúscula */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default HistorialOrdenes;
