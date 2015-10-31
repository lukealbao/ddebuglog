var util = require('util');
var sprintf = util.format;
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

  var reportName = name.toUpperCase().split(/\W+/).join('');
  var prefixes = reportName + ' ' + process.pid + ':';
  var nameRegex = new RegExp(reportName , 'i');

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
