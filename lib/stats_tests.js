var expect = require('chai').expect;
var fh = require('fh-mbaas-api');


describe('Statistics API', function() {

  it('should increment counter', function(done) {
    fh.stats.inc('test-counter', function(err, data) {
      done(err);      
    });
  });

  it('should decrement counter', function(done) {
    fh.stats.dec('test-counter', function(err, data) {
      done(err);
    });
  });

  it('should record timer value', function(done) {
    fh.stats.timing('test-timer', 500, function(err, data) {
      done(err);
    });
  });

});