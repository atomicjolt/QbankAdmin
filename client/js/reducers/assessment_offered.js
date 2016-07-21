"use strict";

import _                                      from "lodash";
import { Constants as AssessmentConstants }   from "../actions/assessment_offered";

const assessmentOffered = {
  "reviewOptions": {
    "whetherCorrect": {
      "afterAttempt": true,
      "duringAttempt": true,
      "beforeDeadline": true,
      "afterDeadline": true
    },
    "solution": {
      "afterAttempt": true,
      "duringAttempt": false,
      "beforeDeadline": true,
      "afterDeadline": true
    }
  },
  "itemsShuffled": null,
  "description": {
    "text": "DUMMY DATA DESCRIPTION",
    "languageTypeId": "639-2%3AENG%40ISO",
    "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
    "scriptTypeId": "15924%3ALATN%40ISO"
  },
  "itemsSequential": null,
  "bankId": "assessment.Bank%3A577d49564a4045154ead4dd4%40ODL.MIT.EDU",
  "scoreSystemId": "",
  "maxAttempts": null,
  "deadline": null,
  "startTime": null,
  "duration": null,
  "displayName": {
    "text": "FAKE TITLE",
    "languageTypeId": "639-2%3AENG%40ISO",
    "formatTypeId": "TextFormats%3APLAIN%40okapia.net",
    "scriptTypeId": "15924%3ALATN%40ISO"
  },
  "id": "assessment.AssessmentOffered%3A578ea73ecdfc5c5151c454ea%40ODL.MIT.EDU",
  "gradeSystemId": "",
  "recordTypeIds": [
    "assessment-offered-record-type%3Areview-options%40MOODLE.ORG"
  ],
  "assessmentId": "assessment.Assessment%3A577d49584a4045154ead4f17%40ODL.MIT.EDU",
  "levelId": "",
  "assignedBankIds": [
    "assessment.Bank%3A577d49564a4045154ead4dd4%40ODL.MIT.EDU"
  ],
  "genusTypeId": "GenusType%3ADEFAULT%40DLKIT.MIT.EDU",
  "type": "AssessmentOffered"
};

export default (state = assessmentOffered, action) => {
  console.log("In assessment_offered.js reducer");
  switch(action.type){

    case AssessmentConstants.ASSESSMENT_OFFERED + AssessmentConstants.DONE:
      console.log("In ASSESSMENT_OFFERED case.");
      return action.payload;

    default:
      return state;
  }
};
