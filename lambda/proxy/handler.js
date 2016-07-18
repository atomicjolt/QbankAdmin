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
      get("https://qbank-clix-dev.mit.edu/api/v1/assessment/hierarchies/" + thing).
      set("Accept", "application/json").
      then((response) => {
        console.log("Received", thing);
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

  /**
   * Gets the details for a single bank, such as title, description, etc.
   * Updates the bank in-place.
   */
  function getBankDetails(bank) {
    console.log("getBankDetails", bank.id);
    get("nodes/" + bank.id, (response) => {
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
    for(var i in bank.childNodes) {
      var child = bank.childNodes[i];
      getBankDetails(child);
      recursivelyGetBankDetails(child);
    }
  }

  /**
   * Gets the hierarchy of banks appearing under the given root bank.  The
   * hierarchy includes only IDs, not details such as title.
   */
  function getChildren(bank) {
    console.log("getChildren", bank.id);
    get("nodes/" + bank.id + "/children?descendants=10", (response) => {
      console.log("inserting children...");
      bank.childNodes = JSON.parse(response.text);
      for(var i in bank.childNodes) {
        recursivelyGetBankDetails(bank.childNodes[i]);
      }
      console.log("done inserting children");
    });
  }

  // Get the root banks and start filling in the hierarchy and details.
  get("roots", (response) => {
    console.log("Received roots");
    banks = JSON.parse(response.text);
    console.log("Parsed roots");
    for(var i in banks) {
      getChildren(banks[i]);
    }
    console.log("Requested children");
  });
};
