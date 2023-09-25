import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store';

import Login from './containers/login';
import Register from './containers/register';
import Main from './containers/main';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route path='/login' component={Login}></Route>
            <Route path='/register' component={Register}></Route>
            <Route component={Main}></Route>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

