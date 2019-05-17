'use strict';


/**
 * Refreshes your current, valid JWT token and returns a new token.
 *
 * returns authResult
 **/
exports.getRefreshToken = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "accessToken" : "fyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9.eyJjb21wYW55IjoiRnV0dXJlRWQiLCJzdWIiOjEsImlzcyI6Imh0dHA6XC9cL2Z1dHVyZWVkLmRldlwvYXBpXC92MVwvc3R1ZGVudFwvbG9naW5cL3VzZXJuYW1lIiwiaWF0IjoiMTQyNzQyNjc3MSIsImV4cCI6IjE0Mjc0MzAzNzEiLCJuYmYiOiIxNDI3NDI2NzcxIiwianRpIjoiNmFlZDQ3MGFiOGMxYTk0MmE0MTViYTAwOTBlMTFlZTUifQ.MmM2YTUwMjEzYTE0OGNhNjk5Y2Y2MjEwZDdkN2Y1OTQ2NWVhZTdmYmI4OTA5YmM1Y2QwYTMzZjUwNTgwY2Y0MQ"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get a session JWT token to be included in the rest of the requests
 *
 * auth Auth JSON string containing your authentication details.
 * returns authResult
 **/
exports.postAuth = function(auth) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "accessToken" : "fyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9.eyJjb21wYW55IjoiRnV0dXJlRWQiLCJzdWIiOjEsImlzcyI6Imh0dHA6XC9cL2Z1dHVyZWVkLmRldlwvYXBpXC92MVwvc3R1ZGVudFwvbG9naW5cL3VzZXJuYW1lIiwiaWF0IjoiMTQyNzQyNjc3MSIsImV4cCI6IjE0Mjc0MzAzNzEiLCJuYmYiOiIxNDI3NDI2NzcxIiwianRpIjoiNmFlZDQ3MGFiOGMxYTk0MmE0MTViYTAwOTBlMTFlZTUifQ.MmM2YTUwMjEzYTE0OGNhNjk5Y2Y2MjEwZDdkN2Y1OTQ2NWVhZTdmYmI4OTA5YmM1Y2QwYTMzZjUwNTgwY2Y0MQ"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

