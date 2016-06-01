var fh = require('fh-mbaas-api');
var express = require('express');
var util = require('./util');

function getOptionsForAlgorithm(algorithm) {
  return { 'algorithm': algorithm, 'text': 'Text to be hashed.' };
}

function router() {
  var router = new express.Router();

  router.get('/md5', function(req, res) {
    fh.hash(getOptionsForAlgorithm('md5'), util.defaultResponse(res));
  });

  router.get('/sha1', function(req, res) {
    fh.hash(getOptionsForAlgorithm('sha1'), util.defaultResponse(res));
  });

  router.get('/sha256', function(req, res) {
    fh.hash(getOptionsForAlgorithm('sha256'), util.defaultResponse(res));
  });

  router.get('/sha512', function(req, res) {
    fh.hash(getOptionsForAlgorithm('sha512'), util.defaultResponse(res));
  });

  return router;
}

module.exports = {
  router: router
};
