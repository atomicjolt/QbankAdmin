"use strict";

import Network    from "../constants/network";
import wrapper    from "../constants/wrapper";

// Actions that make an api request
const types = [
  "GET_BANK_HIERARCHY"
];

export const Constants = wrapper(types, []);


export function getBankHierarchy(payload) {
  return {
    type: Constants.GET_BANK_HIERARCHY,
    payload
  };
}
