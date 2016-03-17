var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mbaasApi = require('fh-mbaas-api');
var mbaasExpress = mbaasApi.mbaasExpress();

var securableEndpoints = [
  '/cache',
  '/stats'
];

var app = express();

app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);
app.use(express.static(__dirname + '/public'));
app.use(mbaasExpress.fhmiddleware());

app.use(cors());
app.use(bodyParser());

require('./lib/metrics.js').init(app);
app.use('/cache', require('./lib/cache.js').router());
app.use('/stats', require('./lib/stats.js').router());

app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
  console.log('App started at: ' + new Date() + ' on port: ' + port); 
});