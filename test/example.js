var debugString = 'ddebugexample'
var ddebuglog = require(__dirname + '/../dynamic-debuglog');
var debug = ddebuglog(debugString);

var interval = setInterval(
  function () {
    debug('[%s] Debuglog is active. Hit <Enter> to deactivate, '
          + 'or <Ctrl-c> to exit the test.',
          new Date().toLocaleTimeString());
  },
  5e3
);

var debugging = false;
function flipTheSwitch () {
  if (debugging) {
    process.env.NODE_DEBUG = '';
    console.log('Interval is still running, but no longer debugging.',
                'Hit <Enter> to reactivate.\n');
  }
  else {
    process.env.NODE_DEBUG = debugString;
    console.log('Now debugging %s...\n', debugString);
  }
  debugging = !debugging;
}

function goodBye () {
  console.log('\n\nSimple enough, right? Please contact Luke with any questions or comments.\n');
  process.exit(0);
}
process.on('SIGINT', goodBye);
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (d) {
  if (d === '\n') {
    flipTheSwitch();
  }
});

console.log('Hello! Right now a debuglog statement is running on a 5-second interval.');
console.log('Since process.env.NODE_DEBUG has not been set, you cannot see the statements.')
console.log('Hit <Enter> to activate the statements...\n');
