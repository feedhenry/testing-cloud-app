var fh = require('fh-mbaas-api');
var express = require('express');
var winston = require('winston');
var util = require('lib/util.js');

module.exports = {
  router: router,
  save: save,
  load: load,
  remove: remove
};

function router() {
  var router = new express.Router();

  router.get('/save', function(req, res) {
    var options = {
      'key': req.query.key,
      'value': req.query.value,
      'expire': req.query.expire || 60
    };
    save(options, util.defaultResponse(res));
  });

  router.get('/load', function(req, res) {
    load({'key': req.query.key}, util.defaultResponse(res));
  });

  router.get('/remove', function(req, res) {
    remove({'key': req.query.key}, util.defaultResponse(res));
  });

  router.get('/test', function(req, res) {
    util.runTests(req, res, 'Cache API', true);
  });

  return router;
}

function save(options, callback) {
  winston.info('cache.save(' + JSON.stringify(options) + ')');
  options.act = 'save';
  fh.cache(options, logErrorCallback(callback));
}

function load(options, callback) {
  winston.info('cache.load(' + JSON.stringify(options) + ')');
  options.act = 'load';
  fh.cache(options, logErrorCallback(callback));
}

function remove(options, callback) {
  winston.info('cache.remove(' + JSON.stringify(options) + ')');
  options.act = 'remove';
  fh.cache(options, logErrorCallback(callback));
}

function logErrorCallback(next) {
  return function(err, data) {
    if (err) {
      winston.error(err);
    }
    if (next) {
      next(err, data);
    }
  }
}