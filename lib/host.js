var fh = require('fh-mbaas-api');
var express = require('express');
var util = require('./util');

function router() {
  var router = new express.Router();

  router.get('/', function(req, res) {
    fh.host(util.defaultResponse(res));
  });
  router.get('/test', function(req, res) {
    util.runTests(req, res, 'Host API', true);
  });

  return router;
}
module.exports = {
  router: router
};
