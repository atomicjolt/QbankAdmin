"use strict";

require("ssl-root-cas").inject();

var request = require("superagent");


module.exports.handler = function (event, context, callback) {
  if(context.done === undefined) {
    console.log(arguments);
    return;
  }

  if(event.method === "OPTIONS") return;

  var bank_id = event.bank_id;
  var assessment_id = event.assessment_id;

  // Although the values are unused (and empty strings here), QBank's API
  // requires a JSON payload with "name" and "description" keys.
  request.post("https://qbank-clix-dev.mit.edu/api/v1/assessment/banks/" + bank_id + "/assessments/" + assessment_id + "/assessmentsoffered").
    set("Accept", "application/json").
    send('{"name":"","description":""}').
    then((response) => {
      var offer = JSON.parse(response.text);
      context.succeed(offer);
    }, function () {
      console.log("Failed to create offering", bank_id, assessment_id, arguments);
      context.fail();
    });
};
