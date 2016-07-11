"use strict";

import wrapper from "../constants/wrapper";

export const Constants = wrapper([
  "APP_START"
], []);

export function startApp(auth_token) {
  console.log("firing startApp action");
  return {
    type: Constants.APP_START,
    auth_token
  };
}
