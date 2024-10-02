import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './components/MainPage';
import Register from './components/Register';
import Menu from './components/Menu';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={MainPage} />
          <Route path="/registrar" exact component={Register} />
          <Route path="/menu" exact component={Menu} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;