import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Navbar from './NavBar';

const HistorialOrdenes = () => {
    const [ordenes, setOrdenes] = useState([]);

    const listarOrdenes = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/usuario");
            const data = await response.json();
            console.log("Data received:", data);
            setOrdenes(data);
        } catch (error) {
            console.error("Error al listar ordenes:", error);
        }
    };

    useEffect(() => {
        listarOrdenes();
    }, []);
    
    return (
        <div className='mainHistorial'>
            <Navbar />
            <div className='title'>
                <h1>Historial de Ordenes</h1>
            </div>
            <div className='table-view-order'>
                <table className='tabla-ordenes'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>MESA</th>
                            <th>PLATO</th>
                            <th>CANTIDAD</th>
                            <th>OBSERVACION</th>
                            <th>FECHA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenes.map((orden) => (
                            <tr key={orden.id_orden}>
                                <td>{orden.id_orden}</td>
                                <td>{orden.Mesa}</td>
                                <td>{orden.Plato}</td>
                                <td>{orden.Cantidad}</td>
                                <td>{orden.Observacion}</td>
                                <td>{orden.Estado}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorialOrdenes;
