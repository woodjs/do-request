"use strict";

let utils = require('./lib/utils');
let request = require('./lib/request');

let headers = {};


function doRequest(opts, callback) {

  if (!opts.server && !opts.url) return;

  let options = utils.createRequestOptions(opts, headers);
  let url = utils.createRequestUrl(options);

  utils.isContainFiles(options) ?
    request.doMultipartRequest(url, options, callback) : request.doNormalRequest(url, options, callback);
}


doRequest.configHeaders = function (customerHeaders) {
  headers = customerHeaders;
};


module.exports = doRequest;
