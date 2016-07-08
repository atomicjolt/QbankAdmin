"use strict";

import { Constants }  from "../actions/auth";

const initialState = {};

export default (state=initialState, action) => {
  console.log("reducer called!", state, action);

  switch(action.type) {
    case Constants.AUTH_SET:
      console.log("what I want");
      state = {
        auth_token: action.auth_token,
        refresh_token: action.refresh_token
      };
    default:
      console.log("not what I want");
  }

  return state;
};
