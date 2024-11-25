import React from "react";
import { useParams, useHistory } from "react-router-dom";
import './styles/MenuUsers.css';

const MenuUsers = () => {
    const { id_mesa } = useParams(); // Captura el parámetro id_mesa de la URL
    const history = useHistory(); // Inicializa history para redireccionar

    const realizarPedido = () => {
        if (!id_mesa) {
            alert("No se encontró el ID de la mesa. Por favor, intente de nuevo.");
            return;
        }

        history.push({ pathname: `/menuPlato/${id_mesa}`, state: { logged: true } });
    };

    return (
        <div className="mainUsers">
            <div className="cabecera-usuarios">
                <h1>BIENVENIDO USUARIO</h1>
            </div>
            <div className="cuerpo-usuarios">
                <button onClick={realizarPedido} className="pedir-boton">Realizar pedido</button>       
            </div>
        </div>
    );
};

export default MenuUsers;
