var factoryFactory = require('../../lib/factory.js');

describe("Factory", function() {
  var factory;

  beforeEach(function() {
    var config = jasmine.createSpy();

    config.andCallFake(function() {
      return {};
    });

    var generator = jasmine.createSpy();

    generator.andCallFake(function() {
      return {};
    });

    factory = factoryFactory(config, generator);
  });

  it("Factory module should have createConfiguration method", function() {
    expect(factory.createConfiguration).toBeDefined();
    expect(factory.createConfiguration).toEqual(jasmine.any(Function));
  });

  it("Factory module should have createGenerator method", function() {
    expect(factory.createGenerator).toBeDefined();
    expect(factory.createGenerator).toEqual(jasmine.any(Function));
  });

  it("Factory createConfiguration should return a new configuration", function() {
    var config = factory.createConfiguration({ templateEngine: {}, configFile: "msb.yml", bootstrapFile: "msb-settings.xml" });

    expect(config).not.toBeNull();
  });

  it("Factory createGenerator should return a new generator", function() {
    var generator = factory.createGenerator({});

    expect(generator).not.toBeNull();
  });
});
