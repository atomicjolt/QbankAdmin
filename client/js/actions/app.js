"use strict";

import wrapper from "../constants/wrapper";

export const Constants = wrapper(["APP_START", "APP_DISPLAY_ERROR"], []);

export function startApp(auth_token, qBankHost) {
  return {
    type: Constants.APP_START,
    auth_token,
    qBankHost
  };
}

export function displayError(message) {
  return {
    type: Constants.APP_DISPLAY_ERROR,
    message
  };
}
