"use strict";

import React        from "react";
import { connect }  from "react-redux";

import history                  from "../history";
import { setAuthorization }     from "../actions/auth";
import { queryParams }          from "../utils/query_string";

const select = (state) => {
  return {
    rootEndpoint: state.settings.rootEndpoint
  };
};

export class Auth extends React.Component{

  componentWillMount() {
    let params = queryParams();

    if(params.authorization_token && params.refresh_token){
      this.props.setAuthorization(params.authorization_token, params.refresh_token);
      history.push("/");
    }

  }

  render(){
    const googleSignIn = `${this.props.rootEndpoint}authentication/signin/google`;
    return (
      <div>
        <div class="main">
          <h2>Providers</h2>
          <div class="providers">
            <a href={googleSignIn} id="google">Sign In With Google</a>
          </div>
        </div>
      </div>
    );
  }

}

export default connect(select, { setAuthorization })(Auth);

