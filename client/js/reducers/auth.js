"use strict";

import {Constants}  from "../actions/auth";

const initialState = {authenticated: false};

export default (state=initialState, action) => {
  switch(action.type) {
    case Constants.AUTH_SET:
      state = {
        authenticated: true,
        auth_token: action.auth_token,
        refresh_token: action.refresh_token
      };
  }

  return state;
};
