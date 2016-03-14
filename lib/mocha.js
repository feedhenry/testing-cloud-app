var winston = require('winston');

module.exports = {

	run: function(res, apiName, testFile) {
	    winston.info("Running "+ apiName +" tests");

	    var Mocha = require("mocha");
	    var mocha = new Mocha();
	    mocha.ui("bdd");
	    mocha.reporter("json");
	    mocha.addFile(testFile);    
	    var runner = mocha.run(function(failures) {
	        res.status(failures == 0 ? 200 : 500).json(runner.testResults);
	    });
    }

};