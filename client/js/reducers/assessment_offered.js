"use strict";

import _                                      from "lodash";
import { Constants as AssessmentConstants }   from "../actions/assessment_offered";


export default (state = {}, action) => {
  switch(action.type){

    case AssessmentConstants.ASSESSMENT_OFFERED + AssessmentConstants.DONE:
      return action.payload;

    case AssessmentConstants.ASSESSMENT_OFFERED_CLEARED:
      return {};

    default:
      return state;
  }
};
