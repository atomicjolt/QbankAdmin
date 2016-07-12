"use strict";

import Immutable                           from "immutable";
import _                                   from "lodash";
import { Constants as BanksConstants }   from "../actions/banks";

const initialState = Immutable.fromJS({
  "Bank": [{
    "title": "Grade 9",
    "text": "CLIx content for grade 9",
    "id": "assessment.Bank%3A577d49564a4045154ead4dca%40ODL.MIT.EDU",
    "children" : [{
      "title": "English",
      "text": "CLIx content for english",
      "id": "assessment.Bank%3A577d49564a4045154ead4dcc%40ODL.MIT.EDU",
      "children": [{
        "title": "Standard English",
        "text": "CLIx content for standard english",
        "id": "assessment.Bank%3A577d49564a4045154ead4dce%40ODL.MIT.EDU",
        "children": [{
          "title": "Unit 1",
          "text": "CLIx content for Unit 1",
          "id": "assessment.Bank%3A577d49564a4045154ead4dd0%40ODL.MIT.EDU",
          "children": [{
            "title": "Activity 4",
            "text": "CLIx content for activity 4",
            "id": "assessment.Bank%3A577d49564a4045154ead4dd4%40ODL.MIT.EDU",
            "children": [],
            "assessments": [{}]
          },
            {
              "title": "Activity 44",
              "text": "CLIx content for activity 44",
              "id": "assessment.Bank%3A577d49564a4045154ead4dd3%40ODL.MIT.EDU",
              "children": [],
              "assessments": [{}]
            }],
          "assessments": [{}]
        }],
        "assessments": [{}]
      }],
      "assessments": [{}]
    },
      {
        "title": "Math",
        "text": "CLIx content for math",
        "id": "assessment.Bank%3A577d49564a4045154ead4dcb%40ODL.MIT.EDU",
        "children": [{}],
        "assessments": [{}]
      }],
  }]
});

export default (state = initialState, action) => {
  switch(action.type){

    default:
      return state;
  }
};
