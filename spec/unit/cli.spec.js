var _ = require('underscore'),
    cliFactory = require('../../lib/cli.js'),
    Q = require('q');

describe("Cli", function() {
  var bootstrap;
  var Cli;
  var run;
  var cliEnv = {};

  var print;

  beforeEach(function() {
    run = jasmine.createSpy('run');

    bootstrap = function() {
      return {
        run: run
      };
    };

    print = jasmine.createSpy();
    print.andCallFake(function (str) {});

    Cli = cliFactory(bootstrap, cliEnv, print);
  });

  it("Running exectute should call the bootstrap", function() {
    var q = jasmine.createSpyObj('q', ['catch']);

    run.andCallFake(function() {
      return q;
    });

    var cli = new Cli();

    spyOn(cli, 'loadEnvironmentOptions').andCallThrough();

    cli.execute();

    expect(cli.loadEnvironmentOptions).toHaveBeenCalled();
    expect(run).toHaveBeenCalled();
  });

  it("An error is shown when something went wrong during the execution of the bootstrap", function() {
    run.andCallFake(function() {
      return Q.fcall(function() {
        throw new Error("There is an error somewhere");
      });
    });

    var cli = new Cli();

    spyOn(cli, 'loadEnvironmentOptions').andCallThrough();

    cli.execute();

    waitsFor(function() {
      return print.calls.length === 2;
    }, "print should have been called twice", 100);

    runs(function() {
      expect(cli.loadEnvironmentOptions).toHaveBeenCalled();
      expect(run).toHaveBeenCalled();
      expect(print.calls.length).toEqual(2);
      expect(print.calls[0].args[0]).toEqual("An error occured during the settings.xml generation: There is an error somewhere");
    });
  });

  it("MSB configuration file and bootstrap file can be set from the environment variables", function() {
    cliEnv.MSB_CONFIG_FILE = 'msb';
    cliEnv.MSB_BOOTSTRAP_FILE = 'msb-settings';
    cliEnv.MSB_OUTPUT_FILE = 'settings';
    cliEnv.WHATEVER_OPTION = "something";

    var options = new Cli().loadEnvironmentOptions();

    expect(options).toBeDefined();
    expect(_.keys(options).length).toEqual(4);
    expect(options.WHATEVER_OPTION).toBeUndefined();

    expect(options._home).toBeDefined();
    expect(options._home).toEqual(retrieveHomeDir());

    expect(options.configFile).toBeDefined();
    expect(options.configFile).toEqual('msb');

    expect(options.bootstrapFile).toBeDefined();
    expect(options.bootstrapFile).toEqual('msb-settings');

    expect(options.outputFile).toBeDefined();
    expect(options.outputFile).toEqual('settings');
  });
});
