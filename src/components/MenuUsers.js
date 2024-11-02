import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import './styles/MenuUsers.css';

const MenuUsers = () =>{



return (
    <div className="mainUsers">
        <div className="cabecera-usuarios">
            <h1>BIENVENIDO USUARIO</h1>
        </div>
        <div className="cuerpo-usuarios">
            <button className="pedir-boton">Realizar pedido</button>       
        </div>
    </div>

);};

export default MenuUsers;

