"use strict";

import { Constants as ItemsConstants }   from "../actions/items";


export default (state = {}, action) => {
  switch(action.type){

    case ItemsConstants.ASSESSMENT_ITEMS + ItemsConstants.DONE:
      return action.payload;

    default:
      return state;
  }
};
