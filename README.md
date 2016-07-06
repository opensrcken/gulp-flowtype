# About this fork

- Uses textual output rather than JSON output, so error output is not truncated.
- Removes outdated options that flow no longer supports.
- Removed the `abort` option, effectively making it the default behavior.

## gulp-flowtype [![Build Status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url] [![Dependency Status][depstat-image]][depstat-url] [![Gitter chat][gitter-image]][gitter-url]

> Run [Facebook's Flow](http://flowtype.org/) in your gulp pipeline

![gulp-flowtype example](screencap.gif)

## Installation
```shell
$ npm install --save-dev gulp-flowtype
```

### Running Windows?

Flow hasn't provided an official binary as of yet, you can follow the issue here [#6](https://github.com/facebook/flow/issues/6).

If you do manage to compile flow and get it running. You can set the path to your own executable using an environment variable.

``` sh
$ set FLOW_BIN=/path/to/flow
```

### Usage

```js
var react = require('gulp-react');
var flow = require('gulp-flowtype');

gulp.task('typecheck', function() {
  return gulp.src('./*.js')
    .pipe(flow({
        all: false,
        weak: false,
        declarations: './declarations',
        killFlow: false,
        beep: true,
        abort: false
    }))
    .pipe(react({ stripTypes: true })) // Strip Flow type annotations before compiling
    .pipe(gulp.dest('./out'));
});
```

### Options

##### options.killFlow
Type: `Boolean`
Default: `false`
>Kills the Flow server after Typecheck is finished.

##### options.beep
Type: `Boolean`
Default: `true`
>Notify your command prompt of a Typecheck error with a beep

##### options.reporter
Type: `function`
Default: [sindresorhus/jshint-stylish](https://github.com/sindresorhus/jshint-stylish)
>Optionally specify a custom reporter.  This needs to conform to the specifications in http://jshint.com/docs/reporters/

## Release History
 * 2016-07-05    v1.0.0    [Improvement] Forked. Update code to reflect latest version of Flow. Ensure full output is shown, by using textual rather than JSON output. Abort the gulp task by default when there is a compilation error.
 * 2016-01-18    v0.4.9    [Improvement] Update dependencies + fix broken code [#38](https://github.com/charliedowler/gulp-flowtype/pull/38)
 * 2015-09-13    v0.4.8    [Fix] Downgrade flow
 * 2015-05-05    v0.4.7    [Improvement] Add option for custom reporter
 * 2015-04-10    v0.4.6    [Fix] Move flow-bin to peerDependencies + [#25](https://github.com/charliedowler/gulp-flowtype/issues/25) Fix abort option
 * 2015-02-24    v0.4.5    [Bump] flow-bin `v0.4.0`
 * 2015-02-15    v0.4.4    [Fix] [#19](https://github.com/charliedowler/gulp-flowtype/issues/19) Reset passed value when finished
 * 2015-02-07    v0.4.3    [Fix] Move dependency from devDependencies to dependencies
 * 2015-02-06    v0.4.2    [Improvement] Add beep, abort on error and option to override flow executable (broken)
 * 2014-12-15    v0.4.1    [Improvement] Performance improvements & better error handling
 * 2014-11-26    v0.4.0    [Improvement] Tweak success message, check file has `/* @flow */` before running flow and added options
 * 2014-11-23    v0.3.1    [Fix] Changes to previous formatting fix
 * 2014-11-23    v0.3.0    [Fix] Repair formatting issues
 * 2014-11-21    v0.2.0    [Improvement] General improvements
 * 2014-11-19    v0.1.0    Initial release

## Contributing
1. Write test (if applicable)
2. Write code
3. Make tests pass
4. Execute `npm run lint` and make amendments if needed
5. Create pull request
6. Rinse and repeat

## License

MIT © Charlie Dowler

[travis-url]: http://travis-ci.org/charliedowler/gulp-flowtype
[travis-image]: https://secure.travis-ci.org/charliedowler/gulp-flowtype.png?branch=master

[npm-url]: https://npmjs.org/package/gulp-flowtype
[npm-image]: https://badge.fury.io/js/gulp-flowtype.png

[travis-url]: http://travis-ci.org/charliedowler/gulp-flowtype
[travis-image]: https://secure.travis-ci.org/charliedowler/gulp-flowtype.png?branch=master

[depstat-url]: https://david-dm.org/charliedowler/gulp-flowtype
[depstat-image]: https://david-dm.org/charliedowler/gulp-flowtype.png

[gitter-url]: https://gitter.im/charliedowler/gulp-flowtype
[gitter-image]: https://badges.gitter.im/gitterHQ/gitter.png
