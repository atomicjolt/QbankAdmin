"use strict";

import React                    from "react";
import { connect }              from "react-redux";

const select = (state) => (state);

class Index extends React.Component {

  constructor(){
    super();
    this.state = {};
  }

  render(){
    return<div>
      {this.props.children}
    </div>;
  }

}

export default connect(select, null)(Index);