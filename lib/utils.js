"use strict";

exports.createRequestOptions = function (opts, headersConfig) {

  let options = {};
  let defaultConfig = {
    protocol: 'http'
    headers: headersConfig,
    requestPrefix: '',
    path: '',
    method: 'GET'
  };

  Object.assign(options, defaultConfig, opts);

  return options;
};

exports.createRequestUrl = function (options) {

  let host = options.server && options.server.host;
  let port = options.server && options.server.port;

  return options.url ||
          options.protocol + '://' + host + (port ? ':' + port : '') + options.requestPrefix + options.path;
};

exports.isContainFiles = function (options) {

  return options.files ? true : false;
};

exports.isStreamMode
