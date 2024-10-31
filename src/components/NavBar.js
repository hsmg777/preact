import React from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import './styles/NavBar.css';

const Navbar = ({ logged }) => {
  const location = useLocation();
  const history = useHistory();

  const handleMenu = () => {
    history.push({
        pathname: '/Menu',
        state: { logged: true }
      });
  };
  const handleOrders = () => {
    history.push({
        pathname: '/historialOrdenes',
        state: { logged: true }
      });
  };
  const handleHoras = () => {
    history.push({
        pathname: '/historialHoras',
        state: { logged: true }
      });
  };
  const handlePlatos= () => {
    history.push({
        pathname: '/gestionarPlatos',
        state: { logged: true }
      });
  };
  const handleSalir= () => {
    history.push({
        pathname: '/',
        state: { logged: false}
      });
  };
  
  

  return (
    <nav className="navbar">
      <button onClick={() => handleMenu()} className={location.pathname === '/Menu' ? 'active' : ''}>
        Gestionar Usuarios
      </button>
      <button onClick={() => handleOrders("/historialOrdenes")} className={location.pathname === '/historialOrdenes' ? 'active' : ''}>
        Historial Ordenes
      </button>
      <button onClick={() => handleHoras("/historiaHoras")} className={location.pathname === '/historiaHoras' ? 'active' : ''}>
        Historia horas laborales
      </button>
      <button onClick={() => handlePlatos("/gestionarPlatos")} className={location.pathname === '/gestionarPlatos' ? 'active' : ''}>
        Gestionar platos
      </button>
      <button onClick={() => handleSalir("/salir")} className={location.pathname === '/salir' ? 'active' : ''}>
        Salir
      </button>
    </nav>
  );
};

export default Navbar;
