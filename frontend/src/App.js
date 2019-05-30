import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import AuthPage from './pages/Auth/Auth';
import EventsPage from './pages/Events/Events';
import BookingsPage from './pages/Bookings/Bookings';
import MainNavigation from '../src/components/Navigation/MainNavigation';

import AuthContext from './context/auth-context';

import '../src/App.css';

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}>
            <MainNavigation/>
            <main className="main-content">
              <Switch>
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && <Redirect from="/auth" to="/events" exact/>}
                {!this.state.token && <Route path="/auth" component={AuthPage}/>}
                <Route path="/events" component={EventsPage}/>
                {this.state.token && <Route path="/bookings" component={BookingsPage}/>}
                {!this.state.token && <Redirect to="/auth" exact />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
