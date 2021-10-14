import React, { useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import logo from './logo.svg';
import './App.css';

import Landing from './pages/landing'
import Account from './pages/account';
import SignUp from './pages/signup';
import Payee from './pages/payee';
import Transfer from './pages/transfer';
import Admin from './pages/admin';
import Home from './pages/home'


import axios from 'axios';

function App() {
  useEffect(()=>{
    launchFunc()
  }, [])
  
  const launchFunc = () => {
      axios.defaults.baseURL ="http://localhost:5000/"
      axios.defaults.timeout = 10000;
  }
  return (
    <div>
      <Router history={history}>
        <Switch>
          <Route exact path="/" render={props => (<Landing {...props} />)}/>
          <Route exact path="/home" render={props => (<Home {...props} />)}/>
          <Route exact path="/account" render={props => (<Account {...props} />)}/>
          <Route exact path="/signup" render={props => (<SignUp {...props} />)}/>
          <Route exact path="/payee" render={props => (<Payee {...props} />)}/>
          <Route exact path="/transfer" render={props => (<Transfer {...props} />)}/>
          <Route exact path="/admin" render={props => (<Admin {...props} />)}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
