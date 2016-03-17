var winston = require('winston');

module.exports = {

  defaultResponse: function(res) {
    return function(err, data) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(data);
      }
    }
  },

  runTests: function(res, apiName, testFile) {
    winston.info('Running ' + apiName + ' tests');

    var Mocha = require('mocha');
    var mocha = new Mocha();
    mocha.ui('bdd');
    mocha.reporter('json');
    mocha.addFile(testFile);
    var runner = mocha.run(function(failures) {
      res.status(failures == 0 ? 200 : 500).json(runner.testResults);
    });
  }

};