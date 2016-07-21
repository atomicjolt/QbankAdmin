"use strict";

import _                                   from "lodash";
import { Constants as BanksConstants }   from "../actions/banks";

export default (state = [], action) => {
  console.log("In the Banks.js reducer");
  switch(action.type){
    case BanksConstants.GET_BANK_HIERARCHY:
      console.log("In the GET_BANK_HIERARCHY case.");
      return action.payload;

    default:
      return state;
  }
};
