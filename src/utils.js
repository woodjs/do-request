exports.createRequestOptions = function (opts) {

  let options = {};
  let headers = opts.configHeaders && opts.configHeaders(opts.req);
  let defaultConfig = {
    protocol: 'http',
    headers: headers || null,
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


exports.isStreamMode = function (options) {

  return options.res ? true : false;
};


exports.modifyResponseObject = function (res, callback) {

  return callback ? callback(res) : res;
};


exports.defaultResultHandler = function (callback) {

  return function (err, res, body) {

    if (err) {

      err.publish && err.publish();

      return callback(res, {
        success: false,
        message: '后端服务错误！'
      });
    }

    if (res.statusCode === 404) {

      return callback(res, {
        success: false,
        message: '后端服务404错误！'
      });
    }

    if (body) {

      try {
        body = typeof body === 'string' ? JSON.parse(body) : body;
      } catch (e) {

        let temp = body;

        body = {};
        body.result = temp;
      }

      body.success = (res && res.statusCode < 400) ? true : false;
    } else {

      body = {};
      body.success = (res && res.statusCode < 400) ? true : false;
    }

    callback && callback(res, body);
  };
};
