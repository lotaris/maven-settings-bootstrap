/**
 * # Template engine
 *
 * Bring the capability to generate the files through a template engine to be
 * able to apply some filtering of variables inside the file paths or contents.
 */
var _ = require('underscore'),
    Q = require('q'),
    path = require('path'),
    Xregexp = require('xregexp').XRegExp;

module.exports = function(swig) {
  /**
   * Constructor
   */
  function TemplateEngine() { }

  _.extend(TemplateEngine.prototype, {
    /**
     * Generate file content by applying some filtering to the content
     *
     * @param {String} path Path to the file to filter its content
     * @param {Object} msb Configuration that contains properties that can be used to filter files
     * @return {String} The file content after filtering is applied
     */
    renderFile: function(path, msb) {
      // Delegate the templating process to Swig
      var result = swig.renderFile(path, msb.vars);

      result = this.replaceProperties(result, msb);

      return result;
    },

    /**
     * Replace the properties in the string by the values from the config. This
     * will override the SWIG variable replacement by more specific values defined
     * in the configuration file.
     *
     * @param {String} str The string where to replace the properties
     * @param {Object} msb Configuration that contains properties that will be used for the replacement process
     * @return {String} The string where all occurrences are replaced
     */
    replaceProperties: function(str, msb) {
      // Be sure there is properties to replace
      if (msb !== undefined && msb.properties !== undefined) {
        // Cache the regex for the dot
        var dotRegex = Xregexp.build("\\.");

        // Do the replacement for each property defined in the configuration file
        _.each(msb.properties, function(propertyValue, propertyKey) {
          // Normalize the property key to be sure '.' is correctly compiled
          var propertyKeyNormalized = Xregexp.replace(propertyKey, dotRegex, "\\.", 'all');

          // Compile the regex that will be used to check and replace the properties
          var reg = Xregexp.build("<" + propertyKeyNormalized + ">([\\s\\S]*?)<\\/" + propertyKeyNormalized + ">", {}, "g");

          // Check if we find a match in the settings.xml content to be replaced
          if (Xregexp.test(str, reg)) {
            var repl = "<" + propertyKey + ">" + propertyValue + "</" + propertyKey + ">";
            str = Xregexp.replace(str, reg, repl, 'all');
          }
        });
      }

      return str;
    }

  });

  return TemplateEngine;
};

module.exports['@require'] = ['swig'];
