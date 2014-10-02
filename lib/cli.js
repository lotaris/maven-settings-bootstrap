/**
 * # Client
 * Entry point to execute the tool
 */
var inflection = require('inflection'),
    _ = require('underscore');

module.exports = function(bootstrap, cliEnv, print) {
  function Cli() { }

  _.extend(Cli.prototype, {
    /**
     * Execute the settings.xml bootstraping
     *
     * @return {Q.Promise} A promise which the result of the process
     */
    execute: function() {
      return new bootstrap(this.loadEnvironmentOptions()).run().catch(function(e) {
        print("An error occured during the settings.xml generation: " + e.message);
        print(e.stack);
      });
    },

    /**
     * Retrieve from the environment variables the different options that
     * can be used by the tool
     *
     * ```
     * options:
     *   MSB_CONFIG_FILE:
     *      The configuration file
     *      default: ~/.m2/msb.yml (maven user home directory)
     *   MSB_BOOTSTRAP_FILE:
     *      The settings.xml template from which to bootstrap the effective settings.xml
     *      default: msb-settings.xml (current working directory)
     *   MSB_OUTPUT_FILE:
     *      The file path to the place where the settings.xml will be generated
     *      default: settings.xml (current working directory)
     * ```
     *
     * @return {Object} The options retrieved from the variables
     */
    loadEnvironmentOptions: function() {
      var options = _.reduce([ 'configFile', 'bootstrapFile', 'outputFile' ], function(memo, name) {
        var envName = 'MSB_' + inflection.underscore(name).toUpperCase();

        if (_.has(cliEnv, envName)) {
          memo[name] = cliEnv[envName];
        }

        return memo;
      }, {});

      options = _.extend(options, {
        _home: process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
      });

      return options;
    }
  });

  return Cli;
};

module.exports['@require'] = [ 'bootstrap', 'cli.env', 'print' ];
