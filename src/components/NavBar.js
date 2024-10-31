import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css'
const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/Menu">Gestionar Usuarios</Link>
      <Link to="/">Historial Ordenes</Link>
      <Link to="/">Historia horas laborales</Link>
      <Link to="/">Gestionar platos</Link>
      <Link to="/">Salir</Link>
    </nav>
  );
};

export default Navbar;
