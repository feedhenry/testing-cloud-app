var express = require('express');
var fh = require('fh-mbaas-api');
var winston = require('winston');
var mocha = require('lib/mocha.js');

module.exports = {
  router: router,
  save: save,
  load: load,
  remove: remove
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

  router.get('/save', function(req, res) {
    var options = {
      "key": req.query.key,
      "value": req.query.value,
      "expire": req.query.expire || 60
    };
    save(options, cb(res));
  });

  router.get('/load', function(req, res) {
    load({
      "key": req.query.key
    }, cb(res));
  });

  router.get('/remove', function(req, res) {
    remove({
      "key": req.query.key
    }, cb(res));
  });

  router.get('/test', function(req, res) {
    mocha.run(res, "Cache API", "lib/cacheTests.js");
  });

  return router;
}

function save(options, callback) {
  winston.info("cache.save(" + JSON.stringify(options) + ")");
  options.act = "save";
  fh.cache(options, logErrorCallback(callback));
}

function load(options, callback) {
  winston.info("cache.load(" + JSON.stringify(options) + ")");
  options.act = "load";
  fh.cache(options, logErrorCallback(callback));
}

function remove(options, callback) {
  winston.info("cache.remove(" + JSON.stringify(options) + ")");
  options.act = "remove";
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