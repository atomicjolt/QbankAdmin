"use strict";

import { Constants }  from "../actions/banks";


/**
 * Splits a string into contiguous chunks of 3 classes: numbers, blanks, and
 * everything else.  Runs of blanks are collapsed to a single space.
 */
function splitChunks(s) {
  let r = /^(?:(\d+)|(\s+)|((?:(?!\d|\s).)+))/;
  let a = [];

  while(s.length > 0) {
    let m = s.match(r);
    if(m[1]) {                  // digits
      s = s.slice(m[1].length);
      a.push(parseInt(m[1]));
    } else if(m[2]) {           // blanks
      s = s.slice(m[2].length);
      a.push(" ");
    } else {                    // everything else
      s = s.slice(m[3].length);
      a.push(m[3]);
    }
  }

  return a;
}

/**
 * Compares two strings "naturally", the way a human would, by sorting numbers
 * as number (not as characters) and taking word breaks into account.
 */
function naturalCompare(s1, s2) {
  let a1 = splitChunks(s1), a2 = splitChunks(s2);
  let n = Math.min(a1.length, a2.length);

  for(let i = 0; i < n; i++) {
    let v1 = a1[i], v2 = a2[i];
    if(typeof v1 !== "number" || typeof v2 !== "number") {
      v1 = String(v1);
      v2 = String(v2);
    }
    if(v1 < v2) return -1;
    if(v1 > v2) return 1;
  }

  if(a1.length < a2.length) return -1;
  if(a1.length > a2.length) return 1;
  return 0;
}

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

export default (state = [], action) => {
  switch(action.type){
    case Constants.GET_BANK_HIERARCHY:
      let banks = action.payload;
      sortBanks(banks);
      return banks;

    default:
      return state;
  }
};
