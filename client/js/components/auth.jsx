"use strict";

import React        from "react";
import { connect }  from "react-redux";

const select = (state) => {
  return {
    rootEndpoint: state.settings.rootEndpoint
  };
};

export class Auth extends React.Component{

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

export default connect(select)(Auth);

