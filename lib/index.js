// # Maven Settings Bootstrap
// Generate new settings.xml from settings template files.
//
// This tool provides a pattern to run sequential asynchronous steps while
// avoiding callbacks with the use of [promises](http://promises-aplus.github.io/promises-spec/).
// Promises are provided by the [q](https://github.com/kriskowal/q) library.
// In addition, [Swig](http://paularmstrong.github.io/swig) is used to render the project template files.
var ioc = require('./ioc');

// ## Components
//
// * [cli.js](cli.js.html) - The cli brings the capability to execute the tool from the command `msb`;
// * [cli.env.js](cli.env.js.html) - The cli environment is a wrapper to get the process.env;
// * [config.js](config.js.html) - the class that store the configuration and the state of the tool across all the steps of execution;
// * [generator.js](generator.js.html) - module to generate the effective settings.xml;
// * [print.js](print.js.html) - simple wrapper for the console.log at the moment but can be improved for better outputs;
// * [template.engine.js](template.engine.js.html) - for the file generation, a template engine is used. Currently, SWIG is used.

module.exports = {
  cli: ioc.create('cli'),
  version: require('../package').version
};
