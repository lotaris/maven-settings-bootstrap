/**
 * # Factory
 *
 * Allow creating different object for the plumbing of the tool
 */
var ioc = require('./ioc');

module.exports = function(config, generator) {
  return {
    /**
     * Create a new configuration with the options given
     *
     * @param {Object} options The options to create the new configuration
     * @return {Configuration} The configuration created
     */
    createConfiguration: function(options) {
      return new config(options);
    },

    /**
     * Create a new generator from the configuration
     *
     * @param {Configuration} configuration The configuration to create the generator
     * @return {Generator} The generator created
     */
    createGenerator: function(configuration) {
      return new generator(configuration);
    }
  };
};

module.exports['@require'] = ['config', 'generator'];
