"use strict";

import wrapper    from "../constants/wrapper";

export const Constants = wrapper(["ASSESSMENT_OFFERED"], []);

export function assessmentOffered(bankId, assessmentId) {
  console.log("In the assessmentOffered action");
  return {
    type:      Constants.ASSESSMENT_OFFERED,
    bankId,
    assessmentId
  };
}

