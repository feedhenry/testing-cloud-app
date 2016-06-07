var fhComponentMetrics = require('fh-component-metrics');
var winston = require('winston');

module.exports = {

  init: function(app) {
    var metricsTitle = process.env.FH_METRICS_TITLE || 'testing-cloud-app';
    var metricsConf = {
      enabled: process.env.FH_METRICS_ENABLED || false,
      host: process.env.FH_METRICS_HOST || '209.132.178.93',
      port: process.env.FH_METRICS_PORT || 2003
    };

    winston.info('Initializing metrics with configuration:');
    winston.info(JSON.stringify(metricsConf));

    if (metricsConf.enabled) {
      var metrics = fhComponentMetrics(metricsConf);
      metrics.memory(metricsTitle, {interval: 2000}, function(err) {
        if (err) {
          winston.error(err);
        }
      });
      metrics.cpu(metricsTitle, {interval: 1000}, function(err) {
        if (err) {
          winston.error(err);
        }
      });
      app.use(fhComponentMetrics.timingMiddleware(metricsTitle, metricsConf));
    }

  }

};
