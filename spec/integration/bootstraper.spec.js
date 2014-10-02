var ioc = require('../../lib/ioc.js'),
    configurationFactory = require('../../lib/config.js'),
    fs = require('fs-more'),
    _ = require('underscore'),
    Q = require('q'),
    path = require('path'),
    tmp = require('tmp-sync'),
    bootstrapFactory = require('../../lib/bootstrap.js');

describe("Bootstrap", function() {
  var configFile = path.join('res', 'source', 'msb.yml');
  var bootstrapFile = path.join('res', 'source', 'msb-settings.xml');
  var outputFile = path.join(tmp.in(path.resolve('/tmp')), 'settings.xml');
  var resultSettingsFile = path.join('res', 'result', 'settings.xml');

  var bootstrap;

  beforeEach(function() {
    var Bootstrap = bootstrapFactory();

    bootstrap = new Bootstrap({ _home: retrieveHomeDir() });

    spyOn(bootstrap, 'buildConfiguration').andCallFake(function() {
      var TemplateEngine = ioc.create('template.engine');

      var Configuration = configurationFactory(fs);

      bootstrap.config = new Configuration({
        templateEngine: new TemplateEngine(),
        _home: "",
        configFile: configFile,
        bootstrapFile: bootstrapFile,
        outputFile: outputFile
      });
    });
  });

  it("Generating a settings from a bootstrap file should produce the expected result with all the filtering applied", function() {
    var bootstrapSpy = jasmine.createSpy();

    try {
      bootstrap.run().then(bootstrapSpy, function(e) {
        console.log(e.message);
      });
    }
    catch (e) {
      console.log(e.message);
    }

    waitsFor(function() {
      return bootstrapSpy.calls.length;
    }, "bootstrapSpy should have been called", 1000);

    runs(function() {
      expect(outputFile).toHaveSameContent(resultSettingsFile);
    });
  });
});
