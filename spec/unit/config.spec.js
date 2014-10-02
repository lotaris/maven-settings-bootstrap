var _ = require('underscore'),
    path = require('path'),
    configFactory = require('../../lib/config.js'),
    Q = require('q');

describe("Config", function() {
  var Configuration;

  var yamlContent = "vars:\n  key1: \"value1\"\n  key2: \"value2\"";

  var config;

  beforeEach(function() {
    var fs = {
      readFile: jasmine.createSpy()
    };

    fs.readFile.andCallFake(function(path, options, callback) {
      expect(path).toBeDefined();
      callback(undefined, yamlContent);
    });

    Configuration = configFactory(fs);
    config = new Configuration({ templateEngine: {}, configFile: "msb.yml", bootstrapFile: "msb-settings.xml", outputFile: "settings.xml" });
  });

  it("Some options are mandatory to create a new configuration", function() {
    expect(function() { new Configuration(); }).toBeError("No options provided.");
    expect(function() { new Configuration({}); }).toBeError("No template engine provided.");
    expect(function() { new Configuration({ templateEngine: {}}); }).toBeError("No configuration file provided.");
    expect(function() { new Configuration({ templateEngine: {}, configFile: "msb.yml"}); }).toBeError("No bootstrap file provided.");
    expect(function() { new Configuration({ templateEngine: {}, configFile: "msb.yml", bootstrapFile: "msb-settings.xml"}); }).toBeError("No output file provided.");
    expect(function() { new Configuration({ templateEngine: {}, configFile: "msb.yml", bootstrapFile: "msb-settings.xml", outputFile: "settings.xml"}); }).not.toThrow();

    var conf = new Configuration({ templateEngine: {}, configFile: "msb.yml", bootstrapFile: "msb-settings.xml", outputFile: "settings.xml"});

    expect(conf.templateEngine).toBeDefined();
    expect(conf.templateEngine).toEqual({});

    expect(conf.configFilePath).toBeDefined();
    expect(conf.configFilePath).toEqual(path.resolve("msb.yml"));

    expect(conf.bootstrapFilePath).toBeDefined();
    expect(conf.bootstrapFilePath).toEqual(path.resolve("msb-settings.xml"));

    expect(conf.outputFilePath).toBeDefined();
    expect(conf.outputFilePath).toEqual(path.resolve("settings.xml"));
  });


  it("Should be possible to retrive the msb configuration on a configuration", function() {
    var conf = new Configuration({ templateEngine: {}, configFile: "msb.yml", bootstrapFile: "msb-settings.xml", outputFile: "settings.xml" });

    conf.msb = {
      vars: {
        filter1: "valfilter1",
        filter2: "valfilter2"
      }
    };

    var msbConfig = conf.getMsbConfiguration();

    expect(msbConfig).not.toBeNull();

    expect(msbConfig.vars.filter1).toBeDefined();
    expect(msbConfig.vars.filter1).toEqual("valfilter1");

    expect(msbConfig.vars.filter2).toBeDefined();
    expect(msbConfig.vars.filter2).toEqual("valfilter2");
  });


  it("MSB configuration should be available when read from YAML file", function() {
    config.readConfiguration();

    expect(config.msb).not.toBeNull();
    expect(config.msb.vars).not.toBeNull();

    expect(config.msb.vars.key1).toBeDefined();
    expect(config.msb.vars.key1).toEqual("value1");

    expect(config.msb.vars.key2).toBeDefined();
    expect(config.msb.vars.key2).toEqual("value2");
  });
});
