"use strict";

import {Constants}  from "../actions/auth";

const initialState = (function () {
  let s = sessionStorage;
  if(s.expires !== undefined && Date.now() < parseInt(s.expires)) {
    return {
      authenticated:  true,
      auth_token:     s.authorization_token,
      refresh_token:  s.refresh_token
    };
  } else {
    return {
      authenticated: false
    };
  }
})();


export default (state=initialState, action) => {
  switch(action.type) {
    case Constants.AUTH_SET:
      sessionStorage.setItem("authorization_token", action.auth_token);
      sessionStorage.setItem("refresh_token", action.refresh_token);

      // For now, we set our own expiry time.  Later, when QBank requires
      // signatures and we need to refresh tokens, QBank will tell us when to
      // expire.
      sessionStorage.setItem("expires", Date.now() + 1/*hr*/ * 60/*min/hr*/ *
                             60/*sec/min*/ * 1000/*milli/sec*/);

      state = {
        authenticated: true,
        auth_token: action.auth_token,
        refresh_token: action.refresh_token
      };
      break;
  }

  return state;
};
