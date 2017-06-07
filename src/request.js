let fs = require('fs');
let request = require('request');
let utils = require('./utils');


exports.doNormalRequest = function (url, options, callback) {

  let data = null;

  if (options.data) {
    data = typeof options.data === 'string' ? options.data : JSON.stringify(options.data);
  }

  let normalOptions = {
    url: encodeURI(url),
    method: options.method,
    headers: options.headers,
    body: data
  };

  utils.isStreamMode(options) ?
    executeStreamMode(normalOptions, options, callback) : executeNormalMode(normalOptions, options, callback);
};


exports.doMultipartRequest = function (url, options, callback) {

  let multipart = [];
  let props = Object.keys(options.files);

  if (opts.data) {
    multipart.push({
      'content-type': 'application/json',
      'body': typeof opts.data === 'string' ? opts.data : JSON.stringify(opts.data)
    });
  }

  props.forEach(function (prop) {

    if (opts.files[prop].name) {

      let filename = encodeURIComponent(opts.files[prop].name);
      let obj = {
        'content-type': opts.files[prop].type,
        'content-disposition': 'attachment; filename=' + filename,
        'body': fs.createReadStream(opts.files[prop].path)
      };

      multipart.push(obj);
    }
  });

  let multipartOptions = {
    uri: encodeURI(url),
    method: options.method,
    headers: options.headers,
    multipart: multipart
  };

  utils.isStreamMode(options) ?
    executeStreamMode(multipartOptions, options, callback) : executeNormalMode(multipartOptions, options, callback);
};


function executeStreamMode(requestOptions, options, callback) {

  request(requestOptions)
    .on('error', function (err) {

      err.publish && err.publish();

      return options.res.send({
        success: false,
        message: '后端服务错误！'
      });
    })
    .pipe(utils.modifyResponseObject(options.res, callback) || options.res);
}


function executeNormalMode(requestOptions, options, callback) {

  request(requestOptions, options.resultHandler ? options.resultHandler(callback) : utils.defaultResultHandler(callback));
}
