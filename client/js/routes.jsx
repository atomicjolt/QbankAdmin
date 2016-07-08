"use strict";

import React                          from 'react'; // if you use jsx, you have to have React imported
import { Router, Route, IndexRoute }  from 'react-router';

import Auth                           from './components/auth';
import Home                           from './components/home';
import Index                          from './components/layout/index';
import appHistory                     from './history';

export default (
  <Router history={appHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={Home} />
      <Route path="auth" component={Auth} />
    </Route>
  </Router>
);
