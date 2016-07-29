"use strict";

import wrapper    from "../constants/wrapper";

export const Constants = wrapper(["ASSESSMENT_OFFER", "ASSESSMENT_CLEAR_SNIPPET"], []);

export function offerAssessment(bankId, assessmentId, qBankHost) {
  return {
    type:      Constants.ASSESSMENT_OFFER,
    bankId,
    assessmentId,
    qBankHost
  };
}

export function clearSnippet() {
  return {
    type:      Constants.ASSESSMENT_CLEAR_SNIPPET,
  };
}
