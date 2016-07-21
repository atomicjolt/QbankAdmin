"use strict";

import _                                   from "lodash";
import { Constants as BanksConstants }   from "../actions/banks";

export default (state = [], action) => {
  switch(action.type){
    case BanksConstants.GET_BANK_HIERARCHY:
      return action.payload;

    default:
      return state;
  }
};
