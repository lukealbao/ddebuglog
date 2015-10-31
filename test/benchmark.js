// NODE_ENV = 'benchmarking'
// NODE_DEBUG = 'catchme'

function emptyFn () {}

var ddbuglog = require(__dirname + '/debug');
var dynDebugDebugMode = ddbuglog('catchme');
var dynDebugNoMatchMode = ddbuglog('nomatch');
var dynDebugNoMatchStaticMode = ddbuglog('nomatch', {useStatic: 'benchmarking'});

var coredebuglog = require('util').debuglog;
var staticDebugDebugMode = coredebuglog('catchme');
var staticDebugNoMatchMode = coredebuglog('nomatch');

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

suite
.add('Running an empty function', function () {
  emptyFn('Hello!', 'These args are not used.');
})
.add('[Non-debug mode] Dynamic debuglog', function () {
  dynDebugNoMatchMode('Hello!', 'I am checking NODE_DEBUG every time.');
})
.add('[Non-debug mode] Node core debuglog', function () {
  staticDebugNoMatchMode('Hello!', 'I am running an empty function.');
})
.add('[Non-debug mode] Dynamic debuglog with active useStatic', function () {
  dynDebugNoMatchStaticMode('Hello!', 'I am literally core util.debuglog.');
})
.add('[Debug mode] Dynamic debuglog', function () {
  dynDebugDebugMode('Hello!', 'I can be turned off if you want.');
})
.add('[Debug mode] Node core debuglog', function () {
  staticDebugDebugMode('Hello!', 'You have to restart the process to stop me.');
})
.on('error', function (err) {
  // We are redirecting console.error when running this benchmark
  console.log(err.target.error);
})
  
.on('cycle', function (event) {
    console.log(String(event.target));
});

process.nextTick(function () {
  suite.run({async: true});
});

