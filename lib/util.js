var util = require('util');
var winston = require('winston');
var Mocha = require('mocha');


var mocha = new Mocha();
mocha.ui('bdd');
mocha.addFile('lib/cache_tests.js');
mocha.addFile('lib/db_tests.js');
mocha.addFile('lib/stats_tests.js');


function HTMLReporter(runner) {
  Mocha.reporters.Base.call(this, runner);
  var escape = Mocha.utils.escape;

  runner.on('suite', function(suite) {
    if (suite.root) {
      return;
    }
    console.log('<section class="suite">');
    console.log('<h1>%s</h1>', escape(suite.title));
    console.log('<dl style="margin-left: 20px">');
  });

  runner.on('suite end', function(suite) {
    if (suite.root) {
      return;
    }
    console.log('</dl>');
    console.log('</section>');
  });

  runner.on('pass', function(test) {
    console.log('<dt style="color: #3c763d">✓ %s</dt>', escape(test.title));
  });

  runner.on('fail', function(test, err) {
    console.log('<dt style="color: #a94442">✖ %s</dt>', escape(test.title));
    console.log('<dd style="color: #777"><code>%s</code></dd>', escape(err));
  });
}


function initMochaReporter(req) {
  var reportType = req.query.report;
  if (!reportType) {
    var contentType = req.get('Content-Type');
    if (contentType === 'json' || contentType === 'application/json') {
      reportType = 'json';
    } else if (contentType === 'html' || contentType === 'text/html') {
      reportType = 'html';
    } else {
      reportType = 'html'; // default
    }
  }
  mocha.reportType = reportType;
  mocha.reporter(reportType === 'html' ? HTMLReporter : reportType);
}


function initMochaGrep(grep, apiName) {
  if (grep) {
    mocha.grep(apiName);
  } else {
    mocha.options.grep = null;
  }
}


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

  runTests: function(req, res, apiName, grep) {
    // it is not possible to run mocha repeatedly with different test files, 
    // as workaround is used filtering via grep, see 
    // https://github.com/mochajs/mocha/issues/1938
    // https://github.com/pghalliday/grunt-mocha-test/issues/108    

    winston.info('Running ' + apiName + ' tests');

    initMochaReporter(req);
    initMochaGrep(grep, apiName);

    var originalLog = console.log;
    var report = "";
    console.log = function() {
      originalLog.apply(null, arguments);
      report += util.format.apply(null, arguments);
    };

    var runner = mocha.run(function(failures) {
      console.log = originalLog;

      res.status(failures == 0 ? 200 : 500);
      if (mocha.reportType === 'json') {
        res.json(runner.testResults);
      } else {
        res.send(report);
      }
    });
  }

};