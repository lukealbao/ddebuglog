# Dynamic Debuglog
Let's say you're using `util.debuglog` to write debugging statements
(like you should), and you wish you could hook in to
`process.env.NODE_DEBUG` to dynamically turn them on and off without
restarting your process. This allows you to do that.

Maybe you have a repl available in your app, or you open a route, or maybe
you want to trigger it programmatically. If you can set a variable on the `process.env` object, you can
turn your debugging statements on and off.

## Performance Notes
In order to be dynamic, this debugger must check
`process.env.NODE_DEBUG` on each debug statement. When in debug mode,
this additional check is totally negligible. But when not debugging,
it still must perform the check. This is much slower than the empty
function that core `util.debuglog` calls when not in debug mode.

No problem! When you instantiate a dynamic debug logger, it will make a
one-time check at `process.env.NODE_ENV`, so it can be parameterized to revert to
the static core version of `util.debuglog` in certain environments. You can be dynamic in development and you can sacrifice flexibility
for speed in production - with no change in code. (See **stingy mode** below for how this works.)

See below for benchmarks. You may choose to go dynamic all the way.

## API: Comparison with `util.debuglog`
`ddbuglog` is designed to be used exactly like you use `util.debuglog`.

```javascript
var coreDebug = require('util').debuglog('neatstuff');
var dynamicDebug = require('ddebuglog')('neatstuff');

coreDebug('This statement never prints.');
dynamicDebug('This statement never prints.');

process.env.NODE_DEBUG = 'neatstuff';

coreDebug('This statement still never prints');
dynamicDebug('But this one prints, because NODE_DEBUG is now %s', process.env.NODE_DEBUG);

// prints to stderr:
// NEATSTUFF 4918: But this one prints, because NODE_DEBUG is now neatstuff
```

### Stingy mode
Can't afford the milliseconds? Youf can choose to revert to core `util.debug` in certain environments. Pass in an object with a `useStatic`
attribute for the second argument:
```javascript
// process.env.NODE_DEBUG not set to 'neatstuff'
var flexibleDebugger = dynamicDebug('neatstuff', {useStatic: 'production'});

process.env.NODE_DEBUG = 'neatstuff';

debug('This will still not print if process.env.NODE_ENV is `production`');

```

`useStatic` can be an Array of strings or a single string. If present
when creating a ddebuglog, it will revert to the static core module when
`process.env.NODE_ENV` matches. Simple enough, right?

### Benchmarks
Using `benchmark.js` on a MacBook Air 2.2GHz i7 with 8GB RAM, here is
a comparison of Node core `util.debuglog` and `ddebuglog`. As you can
see, running in stingy mode is exactly the same as core (because
that's all it is.

If you want to stay dynamic all the way, you can
pass over 1500 non-active debug statements and add only 1ms of latency.

```
[Baseline] Running an empty function x 96,610,538 ops/sec ±0.97% (94 runs sampled)
[Non-debug mode] Dynamic debuglog x 1,499,211 ops/sec ±0.99% (93 runs sampled)
[Non-debug mode] Node core debuglog x 97,839,585 ops/sec ±0.76% (94 runs sampled)
[Non-debug mode] Dynamic debuglog with active useStatic x 96,241,918 ops/sec ±1.91% (92 runs sampled)

[Debug mode] Dynamic debuglog x 160,839 ops/sec ±1.33% (91 runs sampled)
[Debug mode] Node core debuglog x 165,748 ops/sec ±1.28% (92 runs sampled)
```

### License
MIT

### Hopes
You find it useful. :)
