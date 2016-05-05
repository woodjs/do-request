"use strict";

let utils = require('./lib/utils');
let request = require('./lib/request');


function doRequest(opts, callback) {

  if (!opts.server && !opts.url) return;

  let options = utils.createRequestOptions(opts);
  let url = utils.createRequestUrl(options);

  utils.isContainFiles(options) ?
    request.doMultipartRequest(url, options, callback) : request.doNormalRequest(url, options, callback);
}


module.exports = doRequest;
