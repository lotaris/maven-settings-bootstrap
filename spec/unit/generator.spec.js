var _ = require('underscore'),
    path = require('path'),
    generatorFactory = require('../../lib/generator.js'),
    Q = require('q');

describe("Generator", function() {
  var config = {
    msb: {
      vars: {}
    }
  };

  var fs;
  var generator;
  var print;

  beforeEach(function() {
    fs = {
      outputFileQ: jasmine.createSpy()
    };

    config.templateEngine = {
      renderFile: jasmine.createSpy()
    };

    print = jasmine.createSpy();
    print.andCallFake(function(str) {});

    config.getMsbConfiguration = jasmine.createSpy();

    var Generator = generatorFactory(fs, print);

    generator = new Generator(config);
  });

  it ("Create a new generator should have a proper configuration", function() {
    expect(generator.config).toEqual(config);
  });

  it ("GenerateSettings should call fs.outputFile", function() {
    fs.outputFileQ.andCallFake(function(operation, callback) {

    });

    config.getMsbConfiguration.andCallFake(function() {
      return this.msb;
    });

    config.outputFilePath = 'settings.xml';
    config.bootstrapFilePath = 'msb-settings.xml';

    config.templateEngine.renderFile.andCallFake(function(source, options) {
      return 'templateContent';
    });

    generator.generateSettings().catch(function(e) {
      expect(e.stack).toBeNull();
    });

    waitsFor(function() {
      return print.calls.length;
    }, "outputFile should have been called", 100);

    runs(function() {
      expect(config.templateEngine.renderFile).toHaveBeenCalledWith("msb-settings.xml", config.msb);
      expect(fs.outputFileQ).toHaveBeenCalledWith('settings.xml', 'templateContent');
      expect(print).toHaveBeenCalledWith("The 'settings.xml' successfully generated.");
    });
  });
});
