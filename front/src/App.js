import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Main from './lib/Main';
import Cluster from './lib/Cluster'

function App() {
  return (
    <Router>
      <div className="App">

        <Switch>
          <Route path='/clusters'>
            <Cluster />
          </Route>
          <Route path='/'>
            <Main />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App;
