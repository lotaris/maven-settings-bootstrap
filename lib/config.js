/**
 * # Configuration
 *
 * Manage the state of the tool and its configuration to be able to generate
 * settings.xml file from settings-template file.
 */
var _ = require('underscore'),
    Q = require('q'),
    path = require('path'),
    yaml = require('js-yaml');

module.exports = function(fs) {
  /**
   * Constructor
   *
   * ```
   * options:
   *   templateEngine:
   *      Define the template engine to generate the files
   *      Required: true
   *   configFile:
   *      Define the path the configuration file
   *      Required: true
   *   bootstrapFile:
   *      Define the path to the bootstrap file
   *      Required: true
   *   outputFile:
   *      Defile the path to the resulting file
   *      Required: true
   * ```
   */
  function Configuration(options) {
    if (options === undefined) {
      throw new Error("No options provided.");
    }

    if (options.templateEngine === undefined) {
      throw new Error("No template engine provided.");
    }
    else {
      this.templateEngine = options.templateEngine;
    }

    if (options.configFile === undefined) {
      throw new Error("No configuration file provided.");
    }
    else {
      this.configFilePath = path.resolve(options.configFile);
    }

    if (options.bootstrapFile === undefined) {
      throw new Error("No bootstrap file provided.");
    }
    else {
      this.bootstrapFilePath = path.resolve(options.bootstrapFile);
    }

    if (options.outputFile === undefined) {
      throw new Error("No output file provided.");
    }
    else {
      this.outputFilePath = path.resolve(options.outputFile);
    }

    this.msb = {};
  }

  _.extend(Configuration.prototype, {
    /**
     * Retrieve the msb configuration
     *
     * @return {Object} that contains the configuration to generate the settings.xml generation
     */
    getMsbConfiguration: function() {
      return this.msb;
    },

    /**
     * Read the tool configuration file to get the configuration for the
     * effective settings.xml generation.
     *
     * @return {Q.Promise} A promise
     */
    readConfiguration: function() {
      var deferred = Q.defer();

      fs.readFile(this.configFilePath, null, _.bind(function(error, content) {
        if (error) {
          deferred.reject(new Error(error));
        }
        else {
          // Store the template configuration inside the global configuration
          this.msb = yaml.safeLoad(content);
          deferred.resolve();
        }
      }, this));

      return deferred.promise;
    }
  });

  return Configuration;
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['fs-more'];
