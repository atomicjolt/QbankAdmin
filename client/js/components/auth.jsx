"use strict";

import React        from "react";
import { connect }  from "react-redux";

import { setAuthorization }        from "../actions/auth";
import assets                      from "../libs/assets";
import { hashParams, joinParams }  from "../utils/query_string";


const select = (state) => (state.auth);

export class Auth extends React.Component {

  componentWillMount() {
    let params = hashParams();
    this.props.setAuthorization(params.authorization_token,
                                params.refresh_token);
  }

  componentDidMount() {
    // Now that the user is authenticated, navigate back to the app's root.
    let params = hashParams();
    delete params.authorization_token;
    delete params.refresh_token;
    let newHash = joinParams(params);
    // We purposefully do not include a hash path here, so we get back to the
    // app's root:
    let newUrl = location.pathname + "#" + newHash;
    history.pushState(null, null, newUrl);
  }

  render() {
    return (
      <div>
        <p>Signing you in&hellip;</p>
      </div>
    );
  }

}

export default connect(select, { setAuthorization })(Auth);

