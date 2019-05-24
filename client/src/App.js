import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import AuthPage from './pages/Auth';
import BookingsPage from './pages/Bookings';
import EventsPage from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';

import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
        <React.Fragment>
        <MainNavigation/>
        <main className="main-content">
          <Switch>
            <Redirect from="/"  to="/auth" exact></Redirect>
            <Route path="/auth" component={AuthPage}></Route>
            <Route path="/events" component={EventsPage}></Route>
            <Route path="/bookings" component={BookingsPage}></Route>
          </Switch>
        </main>
        </React.Fragment>
      </BrowserRouter>
    </div>
  );
}

export default App;
