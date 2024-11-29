import React, { useState } from "react";
import './styles/FechasStyle.css';
import Navbar from "./NavBar";

const CoreFechas = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [chefRapido, setChefRapido] = useState(null);
  const [platos, setPlatos] = useState([]);

  const consultarDatos = async () => {
    try {
      // Validar fechas
      if (!fechaInicio || !fechaFin) {
        alert("Por favor, seleccione ambas fechas.");
        return;
      }

      // Primer endpoint: obtener el chef más rápido
      const chefResponse = await fetch('http://127.0.0.1:5000/api/registrotiempo/chefmastop', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        }),
      });

      if (!chefResponse.ok) {
        throw new Error("Error al consultar el chef más rápido");
      }

      const chefData = await chefResponse.json();
      setChefRapido(chefData);

      // Verifica el cuerpo que será enviado al segundo endpoint
      const bodyForPlatos = {
        idChef: chefData.ChefID,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      };
      console.log("Cuerpo enviado al segundo endpoint:", bodyForPlatos);

      // Segundo endpoint: obtener los platos del chef
      const platosResponse = await fetch('http://127.0.0.1:5000/api/registrotiempo/platoschef', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyForPlatos),
      });

      if (!platosResponse.ok) {
        throw new Error("Error al consultar los platos del chef");
      }

      const platosData = await platosResponse.json();
      setPlatos(platosData);

    } catch (error) {
      console.error("Error:", error.message);
      alert("Hubo un problema al consultar los datos. Revisa la consola para más información.");
    }
  };

  return (
    <div className="fechas-main-container">
      <Navbar />
      <div className="fechas-header">
        <h1>Chef más rápido y sus 3 platos</h1>
      </div>
      <div className="fechas-inputs-container">
        <div className="fechas-inputs">
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
        <div className="fechas-button">
          <button className="fechas-button-submit" onClick={consultarDatos}>
            Consultar
          </button>
        </div>
      </div>
      <div className="fechas-results-container">
        <div className="fechas-results-chef">
          <h4>Chef más rápido</h4>
          {chefRapido ? (
            <>
              <p>ID: {chefRapido.ChefID}</p>
              <p>Nombre: {chefRapido.ChefNombre}</p>
              <p>Tiempo Promedio: {chefRapido.TiempoPromedioSegundos} segundos</p>
            </>
          ) : (
            <p>No hay datos del chef</p>
          )}
        </div>
        <div className="fechas-results-platos">
          <h4>Platos realizados</h4>
          {platos.length > 0 ? (
            <ul>
              {platos.map((plato) => (
                <li key={plato.id_plato}>
                  {plato.PlatoNombre} - Tiempo Mínimo: {plato.TiempoMinimo} segundos
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay datos de platos</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoreFechas;
