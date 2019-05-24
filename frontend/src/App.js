import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import AuthPage from './pages/Auth/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from '../src/components/Navigation/MainNavigation';

import AuthContext from './context/auth-context';

import '../src/App.css';

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider>
          <MainNavigation/>
          <main className="main-content">
            <Switch>
              <Redirect from="/" to="/auth" exact/>
              <Route path="/auth" component={AuthPage}/>
              <Route path="/events" component={EventsPage}/>
              <Route path="/bookings" component={BookingsPage}/>
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
