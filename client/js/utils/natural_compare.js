"use strict";


/**
 * Splits a string into contiguous chunks of 3 classes: numbers, blanks, and
 * everything else.  Runs of blanks are collapsed to a single space.
 */
function splitChunks(s) {
  // The following regexp has 3 sections in this order: 1) match a run of
  // digits; 2) match a run of spaces (includes tabs, newlines, etc.); and, 3)
  // match runs of everything that is neither a digit nor a space. */
  let r = /^(?:(\d+)|(\s+)|((?:(?!\d|\s).)+))/;
  let a = [];

  while(s.length > 0) {
    let m = s.match(r);
    if(m[1]) {                  // digits
      a.push(parseInt(m[1]));
    } else if(m[2]) {           // blanks
      a.push(" ");
    } else {                    // everything else
      a.push(m[3]);
    }
    s = s.slice(m[0].length);
  }

  return a;
}

/**
 * Compares two strings "naturally", the way a human would, by sorting numbers
 * as number (not as characters) and taking word breaks into account.
 */
export default function naturalCompare(s1, s2) {
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
