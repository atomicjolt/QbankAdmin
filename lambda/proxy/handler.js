"use strict";

var QBankSignature = require("./QBankSignature");

module.exports.handler = function (event, context, callback) {
  if(context.done === undefined) {
    console.log(arguments);
    return;
  }
  console.log(QBankSignature);
  context.succeed();
};
