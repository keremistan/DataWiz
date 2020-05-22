import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Main from './lib/Main';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <Main />
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
