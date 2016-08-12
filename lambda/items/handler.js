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
  var items = [];

  request.get(`${qBankHost}/api/v1/assessment/banks/${event.bankId}/assessments/${event.assessmentId}/items`).
  set("Accept", "application/json").
  then((response) => {
    items = JSON.parse(response.text);
    console.log(`Got items for bank ${event.bankId}, assessment ${event.assessmentId}`);
    context.succeed(items);
  }, () => {
    console.log("Failed to GET assessment items", event.assessmentId, arguments);
    context.fail();
  });
};
