'use strict';

// as a test:
// input:
//    'POST /api/v2/assessment/banks/ HTTP/1.1\naccept: application/json\ndate: Mon, 14 Mar 2016 14:41:27 GMT\nhost: testserver:80\nx-api-proxy: taaccct_instructor'
// hashed but not encoded signature:
//    '\xf7y\x8e\xb5\xca\xf0>H \xf2\xf7\xd2\x10\\s\r\xeen\xcb\x9a\xcd\x94&\xef\x80\xc8\xd0\xa2\xfa5\nZ'
// expected signature:
//    '93mOtcrwPkgg8vfSEFxzDe5uy5rNlCbvgMjQovo1Clo='
// with public key: sIcaXKd67Y80MufpCB73
// and private key: LKswkklexT14vbudS4jOGzHvcEG48O1dAvhcVSJQ

var _ = require("lodash");

var Util = require("./Util");

const ALGORITHM = 'hmac-sha256';
const UNSIGNABLE_HEADERS = ['authorization', 'content-length', 'user-agent', 'expiresHeader'];
const REQUIRED_OPTIONS_KEYS = [
  "method",
  "path",
  "headers",
  "body",
  "credentials"
];
const REQUIRED_HEADERS = [
  'request-line',
  'accept',
  'date',
  'host',
  'x-api-proxy'
];


class QBankSignature {

  setParams(options) {
    this.sanityCheckOptionsHeaders(options);
    this.method = options.method.toUpperCase();
    this.pathName = decodeURI(options.path);
    // TODO(kr) should actually parse the url, or guard for if there isn't one
    var queryString = options.path.split('?')[1] || '';
    this.queryString = this.reconstructQueryString(queryString);
    this.headers = options.headers;
    this.body = options.body;
    this.credentials = options.credentials;
  }

  getAuthorizationString() {
    let header = `Signature headers="${this.getSignedHeaders()}",keyId="${this.credentials.AccessKeyId}",algorithm="${ALGORITHM}",signature="${this.getSignature()}"`;

    return header;
  }

  getStringToSign() {
    let parts = [];
    parts.push(this.method.toUpperCase() + ' ' + this.pathName + ' HTTP/1.1');
    parts.push('accept: ' + this.headers.accept);
    parts.push('date: ' + this.datetime);
    parts.push('host: ' + this.headers.host);
    parts.push('x-api-proxy: ' + this.headers['x-api-proxy']);

    return parts.join('\n');
  }

  getSignature() {
    return Util.hmac(this.credentials.SecretKey, this.getStringToSign());
  }

  isSignableHeader(key) {
    if (key.toLowerCase().indexOf('x-amz-') === 0) return true;
    return UNSIGNABLE_HEADERS.indexOf(key) < 0;
  }

  getSignedHeaders() {
    var allOrderedKeys = ['request-line','accept','date','host','x-api-proxy'];
    var presentOrderedKeys = _.compact(allOrderedKeys.map(function(key) {
      var lowerCaseKey = key.toLowerCase();
      if (this.headers[lowerCaseKey] === undefined) return null;
      if (!this.isSignableHeader(lowerCaseKey)) return null;
      return lowerCaseKey;
    }, this));
    return presentOrderedKeys.join(' ');
  }

  sanityCheckRequiredKeysFor(object, keys) {
    let missingKeys = [];
    if (typeof object !== 'object') throw 'first argument has to be a javascript object';
    if (Object.keys(object).length === 0) throw 'first argument cannot be an empty object';
    if (!Array.isArray(keys)) throw 'second argument has to be an array';
    if (keys.length == 0) throw 'second argument cannot be empty';

    let objKeys = Object.keys(object).map((key) => { return key.toLowerCase();});
    keys.forEach((key) => {
      if (objKeys.indexOf(key.toLowerCase()) === -1) missingKeys.push(key);
    });

    if (missingKeys.length > 0) {
      throw `Missing the following keys in options: ${missingKeys.join(' ')}`;
    }
  }

  sanityCheckOptionsHeaders(options) {
    this.sanityCheckRequiredKeysFor(options, REQUIRED_OPTIONS_KEYS);
    this.sanityCheckRequiredKeysFor(options.credentials, ['SecretKey', 'AccessKeyId']);
    this.sanityCheckRequiredKeysFor(options.headers, REQUIRED_HEADERS);
    if (options.headers.date === undefined) {
      this.datetime = new Date().toLocaleString();
    } else {
      this.datetime = options.headers.date;
    }
  }

  reconstructQueryString(queryString) {
    if (queryString === undefined) return '';
    let arr = queryString.split('&'); // split query to array
    let arr2 = arr.sort((a,b) => { // sort by key
      if (a.split('=')[0] > b.split('=')[0]) {
        return 1;
      } else if (a.split('=')[0] < b.split('=')[0]) {
        return -1;
      } else if (a.split('=')[1] > b.split('=')[1]) {
        return 1;
      } else if (a.split('=')[1] < b.split('=')[1]) {
        return -1;
      } else {
        return 0;
      }
    });

    return arr2.map((query)=>{
      let name = query.split('=')[0];
      let value = query.split('=')[1] || '';
      return Util.uriEscape(name) + '=' + Util.uriEscape(value);
    }).join('&');
  }
};

module.exports = QBankSignature;
