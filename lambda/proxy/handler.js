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
          console.log("Succeeding", banks, assessments);
          attachAssessments();
          context.succeed(banks);
        }
      }, function () {
        console.log("Failed to GET resource", thing, arguments);
        context.fail();
      });
  }

  /**
   * Gets the details for a single bank, such as title, description, etc.
   * Updates the bank in-place.
   */
  function getBankDetails(bank) {
    get("hierarchies/nodes/" + bank.id, (response) => {
      var details = JSON.parse(response.text);

      // The detailed object we get back contains a `childNodes` key with an
      // empty array value, which conflicts with the real `childNodes` value
      // already in the hierarchy.  We preserve the correct value by assigning
      // it to the newly-received object, *then* assign the new object's entries
      // to the original.

      details.childNodes = bank.childNodes;
      Object.assign(bank, details);
    });
  }

  /**
   * Given a hierarchy of banks with no details (title, etc.), recursively walks
   * the hiearchy, requesting details each bank.
   */
  function recursivelyGetBankDetails(bank) {
    getBankDetails(bank);
    for(var i in bank.childNodes) {
      recursivelyGetBankDetails(bank.childNodes[i]);
    }
  }

  /**
   * Gets the hierarchy of banks appearing under the given root bank.  The
   * hierarchy includes only IDs, not details such as title.
   */
  function getChildren(bank) {
    get("hierarchies/nodes/" + bank.id + "/children?descendants=10", (response) => {
      bank.childNodes = JSON.parse(response.text);
      recursivelyGetBankDetails(bank);
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
