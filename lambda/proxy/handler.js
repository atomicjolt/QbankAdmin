"use strict";

var Util = require("./Util");

module.exports.handler = function (event, context, callback) {
  if(context.done === undefined) {
    console.log(arguments);
    return;
  }
  console.log(Util);
  context.succeed();
};
