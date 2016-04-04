var fh = require('fh-mbaas-api');
var fs = require('fs');
var express = require('express');
var winston = require('winston');
var util = require('./util');
var dummyjson = require('dummy-json');

module.exports = {
  router: router
};

function router() {
  var router = new express.Router();
  var defaultType = 'test-collection';
  var userTemplate = fs.readFileSync('templates/user.hbs', {encoding: 'utf8'});

  router.get('/create', function(req, res) {
    var type = req.query.type || defaultType;
    var data = req.query.data;
    if (!data) {
      data = JSON.parse(dummyjson.parse(userTemplate));
    }
    fh.db({
      'act': 'create',
      'type': type,
      'fields': data
    }, util.defaultResponse(res));
  });

  router.get('/update', function(req, res) {
    var type = req.query.type || defaultType;
    var guid = req.query.guid;    
    var data = req.query.data;
    fh.db({
      'act': 'update',
      'type': type,
      'guid': guid,
      'fields': data
    }, util.defaultResponse(res));
  });

  router.get('/read', function(req, res) {
    var type = req.query.type || defaultType;
    var guid = req.query.guid;
    fh.db({
      'act': 'read',
      'type': type,
      'guid': guid
    }, util.defaultResponse(res));
  });

  router.get('/list', function(req, res) {
    var type = req.query.type || defaultType;
    fh.db({
      'act': 'list',
      'type': type
    }, util.defaultResponse(res));
  });

  router.get('/delete', function(req, res) {
    var type = req.query.type || defaultType;
    var guid = req.query.guid;
    fh.db({
      'act': 'delete',
      'type': type,
      'guid': guid
    }, util.defaultResponse(res));
  });

  router.get('/deleteall', function(req, res) {
    var type = req.query.type || defaultType;
    fh.db({
      'act': 'deleteall',
      'type': type
    }, util.defaultResponse(res));
  });

  router.get('/test', function(req, res) {
    util.runTests(req, res, 'Database API', true);
  });

  return router;
}