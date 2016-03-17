var fh = require('fh-mbaas-api');
var express = require('express');
var winston = require('winston');
var util = require('lib/util.js');

module.exports = {
  router: router
};

function router() {
  var router = new express.Router();

  router.get('/inc', function(req, res) {
    var counter = req.query.counter || 'test-counter';
    winston.info('stats.inc(' + counter + ')');
    fh.stats.inc(counter, util.defaultResponse(res));
  });

  router.get('/dec', function(req, res) {    
    var counter = req.query.counter || 'test-counter';
    winston.info('stats.dec(' + counter + ')');
    fh.stats.dec(counter, util.defaultResponse(res));
  });

  router.get('/timing', function(req, res) {    
    var timer = req.query.timer || 'test-timer';
    var value = req.query.value || 500;
    winston.info('stats.timing(' + counter + ', ' + value + ')');
    fh.stats.timing(timer, value, util.defaultResponse(res));
  });

  router.get('/test', function(req, res) {
    util.runTests(req, res, 'Statistics API', true);
  });

  return router;
}