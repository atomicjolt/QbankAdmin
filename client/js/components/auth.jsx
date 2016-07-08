"use strict";

import React        from "react";
import { connect }  from "react-redux";

import { setAuthorization }  from "../actions/auth";
import history               from "../history";
import assets                from "../libs/assets";
import { QueryString }       from "../utils/query_string";


@connect((state) => (state.auth), {setAuthorization}, null, {withRef: true})
class Auth extends React.Component {

  componentWillMount() {
    let params = QueryString.params();
    this.props.setAuthorization(params.authorization_token,
                                params.refresh_token);
  }

  componentDidMount() {
    // Now that the user is authenticated, navigate back to the app's root.
    let newUrl = /*location.protocol + "//" + location.host +*/ location.pathname;
    console.log("newUrl", newUrl);
    history.pushState(null, "title", newUrl);
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
