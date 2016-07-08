"use strict";

import React  from "react";

import assets                from "../libs/assets";
import { setAuthorization }  from "../actions/auth";

export default class Auth extends React.Component {

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
    setAuthorization(params.authorization_token, params.refresh_token);
  }

  render(){
    return (<p>Welcome!</p>);
  }

}
