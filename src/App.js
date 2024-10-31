import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './components/MainPage';
import Register from './components/Register';
import Menu from './components/Menu';
import MenuUsers from './components/MenuUsers';
import HistorialOrdenes from './components/HistorialOrdenes';
import { PrivateRoute } from './components/PrivateRoute';

function Placeholder({ text }) {
  return <h2>{text} - Página en construcción</h2>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={MainPage} />
          <PrivateRoute path="/registrar" exact component={Register} />
          <PrivateRoute path="/Menu" exact component={Menu} />
          <PrivateRoute path="/menuUser" exact component={MenuUsers} />
          <PrivateRoute path="/historialOrdenes" exact component={HistorialOrdenes} />

          {/* Rutas placeholder */}
          <PrivateRoute path="/historiaHoras" exact component={() => <Placeholder text="Historia horas laborales" />} />
          <PrivateRoute path="/gestionarPlatos" exact component={() => <Placeholder text="Gestionar platos" />} />
          <PrivateRoute path="/salir" exact component={() => <Placeholder text="Salir" />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
