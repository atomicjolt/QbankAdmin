"use strict";

import _                                      from "lodash";
import { Constants }   from "../actions/assessments";


export default (state = {}, action) => {
  switch(action.type){

    case Constants.ASSESSMENT_OFFER + Constants.DONE:
      return action.payload;

    case Constants.ASSESSMENT_CLEAR_SNIPPET:
      return {};

    default:
      return state;
  }
};
