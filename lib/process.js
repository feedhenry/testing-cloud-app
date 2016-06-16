var express = require('express');

function router() {
  var router = new express.Router();

  router.get('/version', function(req, res) {
    var parsed_version = process
      .version
      .match(/^v(\d+)\.(\d+).(\d+)/)
      .slice(1)
      .map(Number);
      
    res.status(200).json({
      version: process.version,
      parsed: parsed_version
    });
  });

  return router;
}

module.exports = {
  router: router
};
