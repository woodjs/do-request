"use strict";

let utils = require('./lib/utils');
let request = require('./lib/request');

function doRequest(opts, callback) {

  if (!opts.server && !opts.url) return;

  let headersConfig = {};
  let options = utils.createRequestOptions(opts, headersConfig);
  let url = utils.createRequestUrl(options);

  utils.isContainFiles(options) ?
    request.doMultipartRequest(url, options) : request.doNormalRequest(url, options)
}

module.exports = doRequest;
