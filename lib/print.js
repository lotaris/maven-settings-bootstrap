/**
 * # Print
 *
 * Wrapper around `console.log` for injection purpose.
 */
module.exports = function() {
  return console.log;
};
module.exports['@require'] = [];
