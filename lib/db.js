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
  var userTemplate = fs.readFileSync('templates/user.hbs', {
    encoding: 'utf8'
  });


  router.post('/create', function(req, res) {

    var data = {
      "name": req.body.name
    }

    fh.db({
      'act': 'create',
      'type': defaultType,
      'fields': data
    }, util.defaultResponse(res));

  });


  router.put('/update', function(req, res) {
    var guid = req.query.guid;
    var data = req.query.data;
    fh.db({
      'act': 'update',
      'type': defaultType,
      'guid': req.body.guid,
      'fields': {
        "name": req.body.name
      }
    }, util.defaultResponse(res));
  });

  router.get('/read', function(req, res) {
    var guid = req.query.guid;
    fh.db({
      'act': 'read',
      'type': defaultType,
      'guid': guid
    }, util.defaultResponse(res));
  });

  router.get('/list', function(req, res) {
    fh.db({
      'act': 'list',
      'type': defaultType
    }, util.defaultResponse(res));
  });

  router.delete('/delete', function(req, res) {
    var guid = req.query.guid;
    fh.db({
      'act': 'delete',
      'type': defaultType,
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

  router.get('/index', function(req, res) {
    var type = req.query.type || defaultType;
    fh.db({
      'act': 'index',
      'type': type,
      'index': {
        'location': '2D',
        'user.name': 'ASC',
        'price': 'DESC'
      }
    }, util.defaultResponse(res));
  });

  router.get('/test', function(req, res) {
    util.runTests(req, res, 'Database API', true);
  });

  return router;
}
