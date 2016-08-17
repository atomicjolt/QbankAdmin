"use strict";

import { Constants }   from "../actions/assessments";


export default (state = [], action) => {
  switch(action.type){

    case Constants.ASSESSMENT_ITEMS + Constants.DONE:
      return action.payload;

    case Constants.CLEAR_ASSESSMENT_ITEMS:
      return [];

    default:
      return state;
  }
};
