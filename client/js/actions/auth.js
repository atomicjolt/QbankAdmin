"use strict";

import wrapper from "../constants/wrapper";

const types = [
  "AUTH_SET"
];

export const Constants = wrapper(types, []);

export function setAuthorization(auth_token, refresh_token) {
  console.log("Firing AUTH_SET", auth_token, refresh_token);
  return {
    type: Constants.AUTH_SET,
    auth_token,
    refresh_token
  };
}
