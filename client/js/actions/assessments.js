"use strict";

import wrapper    from "../constants/wrapper";

export const Constants = wrapper(
  [
    "SHOW_ASSESSMENT",
    "ASSESSMENT_OFFER",
    "CLEAR_ASSESSMENT_OFFERED",
    "ASSESSMENT_ITEMS",
    "CLEAR_ASSESSMENT_ITEMS",
    "ASSESSMENT_SET_AVAILABLE_LOCALES"
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

export function clearAssessmentOffered() {
  return {
    type:      Constants.CLEAR_ASSESSMENT_OFFERED
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

/**
 * Sets the locales that can be set for the assessment preview.  Expects an
 * array of locales, each locale being an array of 2 elements: the 2-letter
 * code, and the user-presentable name.
 */
export function setAvailableLocales(locales) {
  return {
    type: Constants.ASSESSMENT_SET_AVAILABLE_LOCALES,
    locales
  };
}
