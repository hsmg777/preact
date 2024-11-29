import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './components/MainPage';
import Register from './components/Register';
import Menu from './components/Menu';
import MenuUsers from './components/MenuUsers';
import HistorialOrdenes from './components/HistorialOrdenes';
import GestionarPlatos from './components/GestionarPlatos';
import RegistrarPlato from './components/RegistarPlato';
import HistorialHoras from './components/HIstorialHoras';
import GestionarMesas from './components/GestionarMesas';
import MenuChef from './components/MenuChef';
import MenuPlato from './components/MenuPlato';
import CoreFechas from './components/CoreFechas';
import { PrivateRoute } from './components/PrivateRoute';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={MainPage} />
          <PrivateRoute path="/registrar" exact component={Register} />
          <PrivateRoute path="/Menu" exact component={Menu} />
          <PrivateRoute path="/menuUser/:id_mesa" exact component={MenuUsers} />
          <PrivateRoute path="/historialOrdenes" exact component={HistorialOrdenes} />
          <PrivateRoute path="/gestionarPlatos" exact component={GestionarPlatos} />
          <PrivateRoute path="/registrarPlato" exact component={RegistrarPlato} />
          <PrivateRoute path="/historialHoras" exact component={HistorialHoras} />
          <PrivateRoute path="/mesas" exact component={GestionarMesas} />
          <PrivateRoute path="/corefechas" exact component={CoreFechas} />
          <PrivateRoute path="/menuChef/:id_User" exact component={MenuChef} /> 
          <PrivateRoute path="/menuPlato/:id_User" exact component={MenuPlato} /> 
        </Switch>
        
      </div>
    </Router>
  );
}

export default App;
