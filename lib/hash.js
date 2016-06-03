var fh = require('fh-mbaas-api');
var express = require('express');
var util = require('./util');

function generateHashcode(req, res) {
  var algorithm = req.path.replace(/\//g,'');
  fh.hash({ 'algorithm': algorithm, 'text': 'Text to be hashed.' }, util.defaultResponse(res));
}

function router() {
  var router = new express.Router();

  router.get('/md5', generateHashcode);
  router.get('/sha1', generateHashcode);
  router.get('/sha256', generateHashcode);
  router.get('/sha512', generateHashcode);
  router.get('/test', function(req, res) {
    util.runTests(req, res, 'Hash API', true);
  });

  return router;
}

module.exports = {
  router: router
};
