"use strict";

import wrapper    from "../constants/wrapper";

export const Constants = wrapper(["ASSESSMENT_OFFER", "ASSESSMENT_CLEAR_SNIPPET"], []);

export function offerAssessment(bankId, assessmentId) {
  return {
    type:      Constants.ASSESSMENT_OFFER,
    bankId,
    assessmentId
  };
}

export function clearSnippet() {
  return {
    type:      Constants.ASSESSMENT_CLEAR_SNIPPET,
  };
}
