var express = require('express');
var fh = require('fh-mbaas-api');
var winston = require('winston');
var mocha = require('lib/mocha.js');

module.exports = {
  router: router
};

function router() {
  var router = new express.Router();

  function cb(res) {
    return function(err, data) {
      if (err) {
        res.status(400).json(err);
      } else {
        res.status(200).json(data);
      }
    }
  }

  router.get('/inc', function(req, res) {
    var counter = req.query.counter || "test-counter";
    winston.info("stats.inc(" + counter + ")");
    fh.stats.inc(counter, cb(res));
  });

  router.get('/dec', function(req, res) {    
    var counter = req.query.counter || "test-counter";
    winston.info("stats.dec(" + counter + ")");
    fh.stats.dec(counter, cb(res));
  });

  router.get('/timing', function(req, res) {    
    var timer = req.query.timer || "test-timer";
    var value = req.query.value || 500;
    winston.info("stats.timing(" + counter + ", " + value + ")");
    fh.stats.timing(timer, value, cb(res));
  });

  router.get('/test', function(req, res) {
    mocha.run(res, "Statistics API", "lib/statsTests.js");
  });

  return router;
}