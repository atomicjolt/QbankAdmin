"use strict";

import { Constants }   from "../actions/banks";
import naturalCompare  from "../utils/natural_compare";


/** Compares two banks according to their display-names. */
function compareBanks(b1, b2) {
  return naturalCompare(b1.displayName.text, b2.displayName.text);
}

/** Sorts a hiearchy of banks recursively, by display-names. */
function sortBanks(banks) {
  banks.sort(compareBanks);
  for(let i in banks) {
    sortBanks(banks[i].childNodes);
  }
}

function addPathIds(bank, path) {
  path = path + "/" + bank.id;
  bank.pathId = path;
  bank.childNodes.forEach((b) => { addPathIds(b, path); });
}

export default (state = [], action) => {
  switch(action.type){
    case Constants.GET_BANK_HIERARCHY:
      let banks = action.payload;
      sortBanks(banks);
      banks.forEach((b) => { addPathIds(b, ""); });
      return banks;

    default:
      return state;
  }
};
