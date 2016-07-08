"use strict";

import React        from "react";
import { connect }  from "react-redux";

import assets                from "../libs/assets";
import { setAuthorization }  from "../actions/auth";


@connect((state) => (state.auth), {setAuthorization}, null, {withRef: true})
class Auth extends React.Component {

  static queryAsMap(query) {
    let pairs = query.split("&");
    let params = {};

    for(let p in pairs) {
      let parts = pairs[p].split("=");
      let key = parts[0], value = parts[1];
      params[key] = value;
    }

    return params;
  }

  componentWillMount() {
    let query = location.search.slice(1);
    let params = Auth.queryAsMap(query);
    this.props.setAuthorization(params.authorization_token, params.refresh_token);
  }

  render() {
    console.log(this.state, this.props);

    return (
      <div>
        <p>Welcome!</p>
        <p>Your tokens:</p>
        <dl>
          <dt>auth</dt><dd>{this.props.auth_token}</dd>
          <dt>refresh</dt><dd>{this.props.refresh_token}</dd>
        </dl>
      </div>
    );
  }

}

export default Auth;
