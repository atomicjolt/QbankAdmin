"use strict";

import React        from 'react';
import { connect }  from 'react-redux';

import { startApp }  from '../actions/app';
import assets        from '../libs/assets';


@connect((state) => (state), {startApp}, null, {withRef: true})
class Home extends React.Component {

  componentWillMount() {
    let p = this.props;
    console.log("this.props", this.props);
    if(p.auth.authenticated && !p.application.started) {
      p.startApp(p.auth.auth_token);
    }
  }

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
        <div>(CLIx logo)</div>
        <div>
          <h1>Filter Tree</h1>
        </div>
        <div>
          <div>(back)</div>
          <hr/>
          <div>(player preview)</div>
          <hr/>
          <div>(embed code)</div>
        </div>
      </div>
    );
  }

}

export { Home as default };
