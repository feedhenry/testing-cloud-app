var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mbaasApi = require('fh-mbaas-api');
var mbaasExpress = mbaasApi.mbaasExpress();
var util = require('./lib/util');

var securableEndpoints = [
  '/cache',
  '/db',
  '/stats',
  '/test'
];

var app = express();

app.use(cors());
app.use(bodyParser());

app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);
//app.use(express.static(__dirname + '/public'));

app.use(mbaasExpress.fhmiddleware());

require('./lib/metrics.js').init(app);
app.use('/cache', require('./lib/cache.js').router());
app.use('/db', require('./lib/db.js').router());
app.use('/stats', require('./lib/stats.js').router());
app.get('/test', function(req, res) {
  util.runTests(req, res, 'MBaaS API');
});
app.get('/service', function(req, res) {
  util.testService(req, res);
});

var runtimeTimer = Date.now() / 1000;
var startTime = new Date();
app.get('/', function(req, res) {
  res.send('Application started: '+ startTime +' and is running for '+ (Date.now() / 1000 - runtimeTimer) +' seconds.<br><a href="/test">/test endpoint</a>');

});

app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
  console.log('App started at: ' + new Date() + ' on port: ' + port);
});
