"use strict";

require("ssl-root-cas").inject();

var request = require("superagent");


module.exports.handler = function (event, context, callback) {
  if(context.done === undefined) {
    console.log(arguments);
    return;
  }

  var banks;
  var outstanding = 0;

  function get(thing, success) {
    ++outstanding;
    console.log("Getting " + thing + ", " + outstanding + " requests");

    request.
      get("https://qbank-clix-dev.mit.edu/api/v1/assessment/hierarchies/" + thing).
      set("Accept", "application/json").
      then((response) => {
        console.log("Received", thing, success);
        success(response);
        // We need to decrement-and-check *after* we call the success function,
        // as that function may add more work to do.
        --outstanding;
        console.log(outstanding + " requests left");
        if(outstanding == 0) {
          console.log("Succeeding", banks);
          context.succeed(banks);
        }
      }, function () {
        console.log("Failed to GET resource", thing, arguments);
        context.fail();
      });
  }

  function getChildren(bank) {
    console.log("getChildren", bank);
    get("nodes/" + bank.id + "/children?descendants=10", (response) => {
      console.log("inserting children...");
      bank.children = JSON.parse(response.text);
      console.log("done inserting children");
    });
  }

  get("roots", (response) => {
    console.log("Received roots", response);
    banks = JSON.parse(response.text);
    console.log("Parsed roots");
    for(var i in banks) {
      getChildren(banks[i]);
    }
    console.log("Requested children");
  });
};
