/* @flow weak */
'use strict';

var Q = require('q');
var fs = require('fs');
require('babel-polyfill');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var flowBin = require('flow-bin');
var logSymbols = require('log-symbols');
var childProcess = require('child_process');

/**
 * Flow check initialises a server per folder when run,
 * we can store these paths and kill them later if need be.
 */
var servers = [];
var passed = true;

function getFlowBin() {
  return process.env.FLOW_BIN || flowBin;
}

function executeFlow(_path, options) {
  var deferred = Q.defer();

  var command = options.killFlow ? function () {
    servers.push(path.dirname(_path));
    return 'check';
  }() : 'status';

  var args = [command, '/' + path.relative('/', _path)];

  var stream = childProcess.spawn(getFlowBin(), args);

  stream.stdout.on('data', function (data) {
    // if (data.indexOf('No errors!') < 0) {
    console.log(data.toString());
    // }
  });

  stream.stdout.on('error', function (data) {
    console.log('STDOUT ERROR: ' + data.toString());
  });

  stream.stderr.on('data', function (data) {
    // if (data.indexOf('flow is still initializing') < 0) {
    console.log(data.toString());
    // }
  });

  stream.stderr.on('error', function (data) {
    console.log('STDERR ERROR: ' + data.toString());
  });

  stream.on('close', function (code) {
    if (code !== 0) {
      deferred.reject(new gutil.PluginError('gulp-flow', 'Flow failed'));
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
}

function checkFlowConfigExist() {
  var deferred = Q.defer();
  var config = path.join(process.cwd(), '.flowconfig');
  fs.exists(config, function (exists) {
    if (exists) {
      deferred.resolve();
    } else {
      deferred.reject('Missing .flowconfig in the current working directory.');
    }
  });
  return deferred.promise;
}

function hasJsxPragma(contents) {
  return (/@flow\b/ig.test(contents)
  );
}

function isFileSuitable(file) {
  var deferred = Q.defer();
  if (file.isDirectory()) {
    deferred.resolve();
  } else if (file.isNull()) {
    deferred.reject();
  } else if (file.isStream()) {
    deferred.reject(new gutil.PluginError('gulp-flow', 'Stream content is not supported'));
  } else if (file.isBuffer()) {
    deferred.resolve();
  } else {
    deferred.reject();
  }
  return deferred.promise;
}

function killServers() {
  var defers = servers.map(function (_path) {
    var deferred = Q.defer();
    childProcess.execFile(getFlowBin(), ['stop'], {
      cwd: _path
    }, deferred.resolve);
    return deferred;
  });
  return Q.all(defers);
}

module.exports = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  options.beep = typeof options.beep !== 'undefined' ? options.beep : true;

  function Flow(file, enc, callback) {
    var _this = this;

    var _continue = function _continue() {
      _this.push(file);
      callback();
    };

    isFileSuitable(file).then(function () {
      var hasPragma = file.contents && hasJsxPragma(file.contents.toString());
      if (options.all || hasPragma) {
        checkFlowConfigExist().then(function () {
          executeFlow(file.path, options).then(_continue, function (err) {
            _this.emit('error', err);
            callback();
          });
        }, function (msg) {
          console.log(logSymbols.warning + ' ' + msg);
          _continue();
        });
      } else {
        _continue();
      }
    }, function (err) {
      if (err) {
        _this.emit('error', err);
      }
      callback();
    });
  }

  return through.obj(Flow, function () {
    var _this2 = this;

    var end = function end() {
      _this2.emit('end');
      passed = true;
    };

    if (passed) {
      console.log(logSymbols.success + ' Flow has found 0 errors');
    } else if (options.beep) {
      gutil.beep();
    }

    if (options.killFlow) {
      if (servers.length) {
        killServers().done(end);
      } else {
        end();
      }
    } else {
      end();
    }
  });
};