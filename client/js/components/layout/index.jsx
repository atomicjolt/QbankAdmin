"use strict";

import React                    from "react";
import { connect }              from "react-redux";

import history                  from "../../history";
import { setAuthorization }     from "../../actions/auth";
import { queryParams }          from "../../utils/query_string";


const select = (state) => (state);

export class Index extends React.Component {

  constructor(){
    super();
    this.state = {};
  }

  componentWillMount() {
    let params = queryParams();

    if(params.authorization_token && params.refresh_token){
      this.props.setAuthorization(params.authorization_token, params.refresh_token);
    }

    if(!this.props.auth.authenticated){
      history.push("auth");
    }

  }

  render(){
    return<div>
      {this.props.children}
    </div>;
  }

}

export default connect(select, { setAuthorization })(Index);