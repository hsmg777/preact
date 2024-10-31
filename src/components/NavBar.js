import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/NavBar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/Menu" className={location.pathname === '/Menu' ? 'active' : ''}>
        Gestionar Usuarios
      </Link>
      <Link to="/historialOrdenes" className={location.pathname === '/historialOrdenes' ? 'active' : ''}>
        Historial Ordenes
      </Link>
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        Historia horas laborales
      </Link>
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        Gestionar platos
      </Link>
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        Salir
      </Link>
    </nav>
  );
};

export default Navbar;
