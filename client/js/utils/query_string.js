function splitAndMap(s) {
  var dict = {};
  var vars = s.split('&');
  for (var i = 0; i < vars.length; i++){
    var pair = vars[i].split('=');
    dict[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return dict;
}

export function queryParams() {
  return splitAndMap(window.location.search.substring(1));
}

export function hashParams() {
  var queryIdx = window.location.hash.indexOf("?");
  if(queryIdx < 0) return {};
  return splitAndMap(window.location.hash.substring(queryIdx + 1));
}

export function joinParams(params) {
  let pairs = [];
  for(let key in params) {
    pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  }
  return pairs.length == 0 ? "" : "?" + pairs.join("&");
}
