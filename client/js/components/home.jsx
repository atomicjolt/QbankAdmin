"use strict";

import React        from 'react';
import { connect }  from 'react-redux';

import assets  from '../libs/assets';


@connect((state) => (state), null, null, {withRef: true})
class Home extends React.Component {

  render() {

    const img = assets("./images/atomicjolt.jpg");

    if(!this.props.auth.authenticated) {
      return (
        <div>
          <div class="main">
            <h2>Providers</h2>
            <div class="providers">
              <a href="https://4h8n6sg95j.execute-api.us-east-1.amazonaws.com/dev/authentication/signin/google" id="google">Sign In With Google</a>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div class="main">
          <h1>QBank Admin</h1>
        </div>
      </div>
    );
  }

}

export { Home as default };
