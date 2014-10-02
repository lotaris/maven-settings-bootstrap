beforeEach(function() {
  this.addMatchers({
    toBeError: function(message) {

      if (typeof this.actual != 'function') {
        throw new Error('Actual is not a function');
      }

      var exception;

      try {
        this.actual();
      }
      catch (e) {
        exception = e;
      }

      var result = exception && (message === undefined || exception.message === message);

      var not = this.isNot ? ' not ' : ' ';

      if (exception && !result) {
        this.message = function() {
          return 'Expected actual to' + not + 'have thrown an error with the message \'' + message + '\' but the message is \'' + exception.message + '\'';
        };
      }
      else if (!result) {
        this.message = function() {
          return 'Expected actual to throw an error but have not throw any error';
        };
      }

      return result;
    }
  });
});

this.retrieveHomeDir = function() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
};
