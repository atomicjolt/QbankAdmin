"use strict";

import wrapper    from "../constants/wrapper";

export const Constants = wrapper(
  [
    "SHOW_ASSESSMENT",
    "ASSESSMENT_OFFER",
    "ASSESSMENT_CLEAR_SNIPPET",
    "ASSESSMENT_ITEMS",
    "CLEAR_ASSESSMENT_ITEMS"
  ],
  []
);

export function offerAssessment(bankId, assessmentId, qBankHost, nOfM) {
  return {
    type:      Constants.ASSESSMENT_OFFER,
    bankId,
    assessmentId,
    qBankHost,
    nOfM
  };
}

export function clearSnippet() {
  return {
    type:      Constants.ASSESSMENT_CLEAR_SNIPPET
  };
}

export function getItems(bankId, assessmentId, qBankHost) {
  return {
    type:     Constants.ASSESSMENT_ITEMS,
    bankId,
    assessmentId,
    qBankHost
  };
}

export function clearItems() {
  return {
    type: Constants.CLEAR_ASSESSMENT_ITEMS
  };
}
