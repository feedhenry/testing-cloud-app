var fh = require('fh-mbaas-api');
var express = require('express');
var util = require('./util');

function router() {
  var router = new express.Router();

  router.post('/', function(req, res) {
    var message = req.body.message;
    var options = req.body.options || {broadcast: true};
    fh.push(message, options, function (err, response) {
      if (err) {
        console.log(err);
        res.status(500).send(err.toString());
      } else {
        res.status(200).send(response.status);
      }
    })
  });

  /*
  Can be implemented in the future
  router.get('/test', function(req, res) {
    util.runTests(req, res, 'Push API', true);
  });
  */

  return router;
}
module.exports = {
  router: router
};
