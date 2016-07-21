"use strict";

import wrapper    from "../constants/wrapper";

export const Constants = wrapper(["ASSESSMENT_OFFERED", "ASSESSMENT_OFFERED_CLEARED"], []);

export function assessmentOffered(bankId, assessmentId) {
  return {
    type:      Constants.ASSESSMENT_OFFERED,
    bankId,
    assessmentId
  };
}

export function assessmentOfferedCleared() {
  return {
    type:      Constants.ASSESSMENT_OFFERED_CLEARED,
  };
}
