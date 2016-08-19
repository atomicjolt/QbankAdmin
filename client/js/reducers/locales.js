"use strict";

import _  from "lodash";

import {Constants}  from "../actions/assessments";


/**
 * Adds locales received from the assessment player into the admin's state.
 * Expects an array of locales, each locale being an array of 2 elements: the
 * 2-letter code, and the user-presentable name.
 */
export default (state = [], action) => {
  console.log("Reducer called!");
  switch(action.type) {

    case Constants.ASSESSMENT_SET_AVAILABLE_LOCALES:
      console.log("Got locales", action.locales);
      return action.locales;

    default:
      return state;
  }
};
