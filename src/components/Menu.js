import React from "react";

const Menu = () =>{

    return(
        <div className="menu-page">
            <div className="cabeceraMenu">
                <h1>BIENVENIDO</h1>
            </div>
            <div className="opciones">
                <button> LISTAR USUARIOS </button>

                <div className="busqueda por id">
                <label>Buscar por id:</label>
                <input type="number" id="id_Usuario"></input>
                <button> BUSCAR</button>
                <button>ACTUALIZAR USUARIO</button>
                <button>ELIMINAR USUARIO</button>
                </div>
                <div className="grid de usuarios">



                </div>
                
            </div>
        </div>
    );
}

export default Menu;