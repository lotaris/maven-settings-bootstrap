/**
 * # Settings file generator
 *
 * Generate the effective settings.xml file
 */
var _ = require('underscore'),
    Q = require('q'),
    path = require('path');

module.exports = function(fs, print) {
  /**
   * Constructor
   *
   * @param {Configuration} config The configuration to build the generator
   */
  function Generator(config) {
    this.config = config;
  }

  _.extend(Generator.prototype, {
    /**
     * Generate the settings.xml file. Take the source file, aplly the templating
     * and store the result to the destination.
     *
     * @return {Q.Promise} A promise to handle the generation
     */
    generateSettings: function() {
      return Q.all([
        fs.outputFileQ(
          this.config.outputFilePath,
          this.config.templateEngine.renderFile(this.config.bootstrapFilePath, this.config.getMsbConfiguration())
        ),
        Q.fcall(_.bind(function() {
          print("The '" + this.config.outputFilePath + "' successfully generated.");
        }, this))
      ]);
    }
  });

  return Generator;
};

module.exports['@require'] = ['fs-more', 'print'];
