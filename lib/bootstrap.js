/**
 * # Bootstrap
 *
 * Brings all the plumbing to execute the settings.xml generation from its template
 */
var ioc = require('./ioc'),
  Q = require('q'),
  swig = require('swig'),
  _ = require('underscore'),
  path = require('path');

module.exports = function() {
  /**
   * Constructor
   *
   * At the moment, only these options are supported:
   *
   * * `configFile`: A path to the `msb` configuration file for the generation process<br /><strong>default</strong>: `~/.m2/msb.yml`
   * * `bootstrapFile`: A path to the bootstrap setting.xml file<br /><strong>default</strong>: `msb-settings.xml`
   * * `outputFile`: A path to the place where the `settings.xml` will be generated. The name of the file itself must be part of the path.<br /><strong>default</strong>: `settings.xml`
   *
   * @params {Object} options The options to create the bootstrap
   */
  function Bootstrap(options) {
    this.factory = ioc.create('factory');

    /**
     * Handle the options and make sure defaults ones are used when
     * no option is given
     */
    this.options = _.defaults(
      _.pick(
        options || {},
        'configFile',
        'bootstrapFile',
        'outputFile'
      ),
      {
        configFile: path.join(options._home, '.m2', 'msb.yml'),
        bootstrapFile: 'msb-settings.xml',
        outputFile: 'settings.xml'
      }
    );
  }

  _.extend(Bootstrap.prototype, {
    /**
     * Initialize the scaffolder
     */
    init: function() {
      this.buildConfiguration();
      this.buildGenerator();
    },

    /**
     * Build the configuration which is the state of the tool
     */
    buildConfiguration: function() {
      var TemplateEngine = ioc.create('template.engine');

      this.config = this.factory.createConfiguration(
        _.extend(
          _.pick(
            this.options,
            'configFile',
            'bootstrapFile',
            'outputFile'
          ),
          {
            templateEngine: new TemplateEngine()
          }
        )
      );
    },

    /**
     * Build the settings.xml generator.
     */
    buildGenerator: function() {
      this.generator = this.factory.createGenerator(this.config);
    },

    /**
     * Run the settings.xml generation.
     *
     * The file operations are processed with non-blocking I/O.
     */
    run: function() {
      this.init();

      // Execute the whole chain of promise
      return this.config.readConfiguration()
        .then(_.bind(this.generator.generateSettings, this.generator));
    }
  });

  return Bootstrap;
};
