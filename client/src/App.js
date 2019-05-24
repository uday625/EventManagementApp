import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Redirect from="/"  to="/auth" exact></Redirect>
          <Route path="/auth" component={AuthPage}></Route>
          <Route path="/events" component={EventsPage}></Route>
          <Route path="/bookings" component={BookingsPage}></Route>
        </Switch>
      </BrowserRouter>
      <p> Hello </p>
    </div>
  );
}

export default App;
