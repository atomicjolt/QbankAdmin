"use strict";

import wrapper    from "../constants/wrapper";

export const Constants = wrapper(["ASSESSMENT_ITEMS"], []);

export function getItems(bankId, assessmentId, qBankHost) {
  return {
    type:      Constants.ASSESSMENT_ITEMS,
    bankId,
    assessmentId,
    qBankHost
  };
}
