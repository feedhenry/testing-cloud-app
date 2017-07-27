var express = require('express');
var util = require('./util');

module.exports = {
  router: router
};

function router() {
  var router = new express.Router();

  router.post('/test', function(req, res) {
    util.runTests(req, res, 'Forms API', true);
  });

  return router;
}