"use strict";

import React                    from "react";
import { connect }              from "react-redux";

import history                  from "../../history";


const select = (state) => {
  return {
    authenticated: state.auth.authenticated
  };
};

export class Index extends React.Component {

  componentWillMount() {
    if(!this.props.authenticated){
      history.push("auth");
    }
  }

  render(){
    return<div>
      {this.props.children}
    </div>;
  }

}

export default connect(select)(Index);