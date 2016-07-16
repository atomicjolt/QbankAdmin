"use strict";

require("ssl-root-cas").inject();

var request = require("superagent");


module.exports.handler = function (event, context, callback) {
  if(context.done === undefined) {
    console.log(arguments);
    return;
  }

  request.
    get("https://qbank-clix-dev.mit.edu/api/v1/assessment/hierarchies/roots").
    set("Accept", "application/json").
    set("Content-type", "application/json").
    then(function good() {
      console.log("good", arguments);
      context.succeed();
    }, function bad() {
      console.log("bad", arguments);
      context.fail();
    });
};
