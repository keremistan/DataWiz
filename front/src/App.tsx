import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { Provider } from 'react-redux'
import { store } from './redux/store'

import Main from './lib/Main';
import Cluster from './lib/Cluster'
import { DataAbsentError, ResourceNotFoundError, ServerDownError } from './lib/Error'

function App() {

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Switch>
            <Route path='/serverDown'>
              <ServerDownError />
            </Route>
            <Route path='/dataAbsent'>
              <DataAbsentError />
            </Route>
            <Route path='/resourceNotFound'>
              <ResourceNotFoundError />
            </Route>
            <Route path='/clusters'>
              <Cluster />
            </Route>
            <Route path='/'>
              <Main />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  )
}

export default App;
