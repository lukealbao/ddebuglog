'use strict';

var util = require('util');
var staticDebugLog = util.debuglog;

var debugs = {};

function createDebugLog (name, opts) {
  if (opts && opts.useStatic) {
    if (typeof opts.useStatic === 'string') {
      opts.useStatic = [opts.useStatic];
    } 
    if (opts.useStatic.indexOf(process.env.NODE_ENV) !== 1) {
      return ( staticDebugLog(name) );
    }
  }

  var prefixes = name.toUpperCase() + ' ' + process.pid + ':';
  var nameRegex = new RegExp('\\b' + name + '\\b' , 'i');

  function ddebuglog () {
    if (nameRegex.test(process.env.NODE_DEBUG)) {
      var logs = util.format.apply(module.exports, arguments);
      console.error(prefixes, logs);
    }
  }
  
  if (!debugs[name]) {
    debugs[name] = ddebuglog;
  }
  
  return debugs[name];
}

module.exports = createDebugLog;
