"use strict";

require("ssl-root-cas").inject();

var request = require("superagent");


module.exports.handler = function (event, context, callback) {
  if(context.done === undefined) {
    console.log(arguments);
    return;
  }

  var banks;
  var qBankHost = event.qBankHost ? event.qBankHost : "https://qbank-clix-dev.mit.edu" ;
  var assessments = [];
  var outstanding = 0;

  function attachToBank(bank, map) {
    bank.assessments = map[bank.id] || [];
    for(var i in bank.childNodes) {
      attachToBank(bank.childNodes[i], map);
    }
  }

  function attachAssessments() {
    var map = {};
    for(var i in assessments) {
      var assessment = assessments[i];
      map[assessment.bankId] = map[assessment.bankId] || [];
      map[assessment.bankId].push(assessment);
    }
    for(i in banks) {
      attachToBank(banks[i], map);
    }
  }

  /**
   * Fetches the resource at the `thing` subpath of QBank's API.  Calls function
   * `success` when the resource is received.  Keeps track of how many requests
   * are still waiting to be received; once all requests are finished, calls the
   * context's `succeed` function with the bank hierarchy as the return value.
   */
  function get(thing, success) {
    ++outstanding;
    console.log("Getting " + thing + ", " + outstanding + " requests");

    request.
      get(qBankHost + "/api/v1/assessment/" + thing).
      set("Accept", "application/json").
      then((response) => {
        console.log("Received", thing);
        success(response);
        // We need to decrement-and-check *after* we call the success function,
        // as that function may add more work to do.
        --outstanding;
        console.log(outstanding + " requests left");
        if(outstanding == 0) {
          attachAssessments();
          context.succeed(banks);
        }
      }, function () {
        console.log("Failed to GET resource", thing, arguments);
        context.fail();
      });
  }

  /**
   * Gets the hierarchy of banks appearing under the given root bank.  The
   * hierarchy includes only IDs, not details such as title.
   */
  function getChildren(bank) {
    get("hierarchies/nodes/" + bank.id + "/children?descendants=10&display_names", (response) => {
      bank.childNodes = JSON.parse(response.text);
    });
  }

  function getAssessments(bank) {
    get("banks/" + bank.id + "/assessments", (response) => {
      var arr = JSON.parse(response.text);
      assessments = assessments.concat(arr);
    });
  }

  // Get the root banks and start filling in the hierarchy and details.
  get("hierarchies/roots", (response) => {
    banks = JSON.parse(response.text);
    for(var i in banks) {
      getChildren(banks[i]);
      getAssessments(banks[i]);
    }
  });
};
