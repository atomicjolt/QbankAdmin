"use strict";

import React        from "react";
import { connect }  from "react-redux";

import history               from "../history";
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

  componentDidMount() {
    // Now that the user is authenticated, navigate back to the app's root.
    location.hash = "";
  }

  render() {
    return (
      <div>
        <p>Signing you in&hellip;</p>
      </div>
    );
  }

}

export default Auth;
