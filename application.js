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
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);
//app.use(express.static(__dirname + '/public'));

app.use(mbaasExpress.fhmiddleware());

require('./lib/metrics.js').init(app);
app.use('/cache', require('./lib/cache.js').router());
app.use('/db', require('./lib/db.js').router());
app.use('/forms', require('./lib/forms.js').router());
app.use('/hash', require('./lib/hash.js').router());
app.use('/host', require('./lib/host.js').router());
app.use('/process', require('./lib/process.js').router());
app.use('/secure', require('./lib/secure.js').router());
app.use('/stats', require('./lib/stats.js').router());
app.use('/push', require('./lib/push.js').router());
app.get('/test', function(req, res) {
  util.runTests(req, res, 'MBaaS API');
});
app.get('/service', function(req, res) {
  util.testService(req, res);
});

var runtimeTimer = Date.now() / 1000;
var startTime = new Date();
app.get('/', function(req, res) {
  res.send('Application started: '+ startTime +' and is running for '+ (Date.now() / 1000 - runtimeTimer) +' seconds.<br><a href="./test">/test endpoint</a><br>Node version: '+process.versions.node);

});

app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
  console.log('App started at: ' + new Date() + ' on port: ' + port);
});
