var path = require('path'),
    BootstrapFactory = require('../../lib/bootstrap.js');

describe("Bootstrap", function() {
  var bootstrap;
  var Bootstrap;

  beforeEach(function() {
    Bootstrap = BootstrapFactory();
    bootstrap = new Bootstrap({ _home: "somewhere" });
  });

  it("Should have several build methods, an init method and a factory", function() {
    expect(bootstrap.factory).toBeDefined();
    expect(bootstrap.init).toBeDefined();
    expect(bootstrap.buildConfiguration).toBeDefined();
    expect(bootstrap.buildGenerator).toBeDefined();
  });

  it("Options should be configured correctly", function() {
    scaff = new Bootstrap({ _home: "somewhere" });

    expect(scaff.options).not.toBeNull();
    expect(scaff.options.configFile).toEqual(path.join("somewhere", '.m2', 'msb.yml'));
    expect(scaff.options.bootstrapFile).toEqual('msb-settings.xml');
    expect(scaff.options.outputFile).toEqual("settings.xml");

    scaff = new Bootstrap({ _home: "somewhere", configFile: 'someOtherConfig.yml' });

    expect(scaff.options).not.toBeNull();
    expect(scaff.options.configFile).toEqual('someOtherConfig.yml');
    expect(scaff.options.bootstrapFile).toEqual('msb-settings.xml');
    expect(scaff.options.outputFile).toEqual("settings.xml");

    scaff = new Bootstrap({ _home: "somewhere", bootstrapFile: 'someOtherSettings' });

    expect(scaff.options).not.toBeNull();
    expect(scaff.options.configFile).toEqual(path.join("somewhere", '.m2', 'msb.yml'));
    expect(scaff.options.bootstrapFile).toEqual('someOtherSettings');
    expect(scaff.options.outputFile).toEqual("settings.xml");

    scaff = new Bootstrap({ _home: "somewhere", configFile: 'someOtherConfig.yml', bootstrapFile: 'someOtherSettings' });

    expect(scaff.options).not.toBeNull();
    expect(scaff.options.configFile).toEqual('someOtherConfig.yml');
    expect(scaff.options.bootstrapFile).toEqual('someOtherSettings');
    expect(scaff.options.outputFile).toEqual("settings.xml");

    scaff = new Bootstrap({ _home: "somewhere", configFile: 'someOtherConfig.yml', bootstrapFile: 'someOtherSettings', outputFile: "someOutput" });

    expect(scaff.options).not.toBeNull();
    expect(scaff.options.configFile).toEqual('someOtherConfig.yml');
    expect(scaff.options.bootstrapFile).toEqual('someOtherSettings');
    expect(scaff.options.outputFile).toEqual("someOutput");
  });

  it("Calling buildConfiguration should prepare a configuration", function() {
    bootstrap.buildConfiguration();

    expect(bootstrap.config).toBeDefined();
  });

  it("Calling buildGenerator should prepare a generator", function() {
    bootstrap.config = {};

    bootstrap.buildGenerator();

    expect(bootstrap.generator).toBeDefined();
  });

  it("Calling init method should call the different build methods", function() {
    spyOn(bootstrap, 'buildConfiguration').andCallFake(function() {});
    spyOn(bootstrap, 'buildGenerator').andCallFake(function() {});

    bootstrap.init();

    expect(bootstrap.buildConfiguration).toHaveBeenCalled();
    expect(bootstrap.buildGenerator).toHaveBeenCalled();
  });
});
