"use strict";

import Api             from "../libs/api";
import QBankSignature  from "./QBankSignature";


// This is adapted from https://github.mit.edu/sei/fbw-app/tree/master/StudentApp/utilities/signingUtil

// Takes a set of credentials and creates a function wrapping `fetch`
// that signs each request using those credentials and returns the
// underyling `fetch` promise.
//
// Requires {AccessKeyId, SecretKey, Host, Email}
export function create(credentials) {
  var qbank = new QBankSignature();

  // TODO(kr) Ideally this would be exactly the same API as `fetch`
  return function(params) {

    // wrapper around global fetch to include signing
    var now = new Date();
    var headers = {};
    var url = 'https://' + credentials.Host + params.path; // TODO(kr) generalize

    headers['x-api-key'] = credentials.AccessKeyId;
    headers['x-api-proxy'] = credentials.Email;
    headers['host'] = credentials.Host;
    headers['request-line'] = params.path;
    headers['accept'] = 'application/json';
    headers['date'] = now.toUTCString();

    var qbankOptions = {
      path: params.path,
      method: params.hasOwnProperty('method') ? params.method : 'GET',
      headers: {
        'request-line': headers['request-line'],
        'accept': headers['accept'],
        'date': now.toUTCString(),
        'host': headers['host'],
        'x-api-proxy': headers['x-api-proxy']
      },
      body: '',
      credentials
    };
    qbank.setParams(qbankOptions);
    var authorizationString = qbank.getAuthorizationString();
    console.log("authorizationString=", authorizationString);

    // alternately: 
    var requestOptions = {
      headers: {
        'authorization': authorizationString,
        'x-api-key': credentials.AccessKeyId,
        'x-api-proxy': credentials.Email,
        'host': credentials.Host,
        'date': now.toUTCString(),
        'accept': 'application/json'
      },

      url,
      method: params.method || 'GET'
    };

    delete requestOptions.headers["x-api-key"];

    return Api.execRequest(
      params.method.toLowerCase() || "get",
      url,
      null, // apiUrl
      null, // jwt
      null, // csrf
      null, // params
      null, // body
      requestOptions.headers
    );

  };
}
