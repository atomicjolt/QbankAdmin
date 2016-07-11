var QBankSignature = require('./QBankSignature');
var requestPromise = require('request-promise');


// This is adapted from https://github.mit.edu/sei/fbw-app/tree/master/StudentApp/utilities/signingUtil

module.exports = {
  // Takes a set of credentials and creates a function wrapping `fetch`
  // that signs each request using those credentials and returns the
  // underyling `fetch` promise.
  //
  // Requires {AccessKeyId, SecretKey, Host, Email}
  create: function(credentials) {
    var qbank = new QBankSignature();

    // TODO(kr) Ideally this would be exactly the same API as `fetch`
    return function(params) {

      // wrapper around global fetch to include signing
      var now = new Date(),
          headers = {},
          url = 'https://' + credentials.Host + params.path; // TODO(kr) generalize

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
      authorizationString = qbank.getAuthorizationString();

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

        url: url,
        method: params.method || 'GET'
      };
      console.log(requestOptions);
      return requestPromise(requestOptions);

    }
  }
};
