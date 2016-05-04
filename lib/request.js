"use strict";

let fs = require('fs');
let urlencode = require('urlencode');
let request = require('request');
let utils = require('./utils');

exports.doNormalRequest = function (url, options) {

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

    if (opts.res) {

      request(normalOptions)
        .on('error', function(err) {
          err.publish();
          return opts.res.send({
            success: false,
            message: '后端服务连接错误！'
          });
        })
        .pipe(createResponseObj(opts.res, callback) || opts.res);

    } else {

      request(normalOptions, createResponseHandle(callback));

    }
};

exports.doMultipartRequest = function (url, options) {
  var multipart = [];
  var props = Object.keys(options.files);

  if (opts.data) {
    multipart.push({
      'content-type': 'application/json',
      'body': typeof opts.data === 'string' ? opts.data : JSON.stringify(opts.data)
    });
  }

  props.forEach(function(prop) {
    if (opts.files[prop].name) {
      var filename = urlencode(opts.files[prop].name);
      var obj = {
        'content-type': opts.files[prop].type,
        'content-disposition': 'attachment; filename=' + filename,
        'body': fs.createReadStream(opts.files[prop].path)
      };

      multipart.push(obj);
    }
  });

  var multipartOptions = {
    uri: encodeURI(url),
    method: options.method,
    headers: {
      'X-USERNAME': options.headers['X-USERNAME']
    },
    multipart: multipart
  };

  if (opts.res) {

    request(multipartOptions)
      .on('error', function(err) {
        err.publish();
        return opts.res.send({
          success: false,
          message: '后端服务连接错误！'
        });
      })
      .pipe(createResponseObj(opts.res, callback) || opts.res);

  } else {

    request(multipartOptions, createResponseHandle(callback));

  }
};


function createResponseObj(res, callback) {

  return callback && typeof callback === 'function' ? callback(res) : res;

}

function createResponseHandle(callback) {

  return function(err, res, body) {

    if (err) {
      err.publish();
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

    if (res && res.headers && res.headers['content-disposition']) {
      return callback(res, body);
    }

    if (body) {
      try {
        body = typeof body === 'string' ? JSON.parse(body) : body;
      } catch (e) {
        var temp = body;
        body = {};
        body.result = temp;
      }

      body.success = (res && res.statusCode <= 299) ? true : false;
    } else {
      body = {};
      body.success = (res && res.statusCode <= 299) ? true : false;
    }
    callback(res, body);
  };
}
