var _ = require('underscore'),
    path = require('path'),
    templateEngineFactory = require('../../lib/template.engine.js'),
    Q = require('q');

describe("Template.Engine", function() {
  var msb = {
    vars: {
      "amazingName": "amazingValue"
    }
  };

  var templateEngine;
  var swig;

  beforeEach(function() {
    swig = {
      renderFile: jasmine.createSpy()
    };

    var TemplateEngine = templateEngineFactory(swig);

    templateEngine = new TemplateEngine();
  });

  it("Rendering a file should be delegated to swig with proper parameters", function() {
    swig.renderFile.andCallFake(function(path, options) {
      return "someFileContentRendered";
    });

    var result = templateEngine.renderFile("some/path/to/a/file", msb);

    expect(swig.renderFile).toHaveBeenCalledWith("some/path/to/a/file", msb.vars);
    expect(result).toEqual('someFileContentRendered');
  });

  it("Replacement of properties will not occur when no configuraiton is given", function() {
    var result = templateEngine.replaceProperties("<first.property>value</first.property>");

    expect(result).toEqual("<first.property>value</first.property>");
  });

  it("Replacement of properties will not occur when no properties defined in the configuration", function() {
    var result = templateEngine.replaceProperties("<first.property>value</first.property>", {});

    expect(result).toEqual("<first.property>value</first.property>");
  });

  it("Replacement of properties will work when only one occurrence of a term is present", function() {
    var properties = {};

    properties["first.property"] = "otherValue";

    var result = templateEngine.replaceProperties("<first.property>value</first.property>", { properties: properties });

    expect(result).toEqual("<first.property>otherValue</first.property>");
  });

  it("Replacement of properties will work when multiple occurrences of a term are present", function() {
    var properties = {};

    properties["first.property"] = "otherValue";

    var result = templateEngine.replaceProperties("<first.property>value</first.property><first.property>value</first.property><first.property>value</first.property>", { properties: properties });

    expect(result).toEqual("<first.property>otherValue</first.property><first.property>otherValue</first.property><first.property>otherValue</first.property>");
  });

  it("Replacement of properties will work when several properties are present", function() {
    var properties = {};

    properties["first.property"] = "firstValue";
    properties["second.property"] = "secondValue";
    properties["third.property"] = "thirdValue";

    var result = templateEngine.replaceProperties("<first.property>value</first.property><second.property>value</second.property><third.property>value</third.property>", { properties: properties });

    expect(result).toEqual("<first.property>firstValue</first.property><second.property>secondValue</second.property><third.property>thirdValue</third.property>");
  });
});
