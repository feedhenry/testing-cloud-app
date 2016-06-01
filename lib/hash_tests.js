var expect = require('chai').expect;
var fh = require('fh-mbaas-api');

function getOptionsForAlgorithm(algorithm) {
  return { 'algorithm': algorithm, 'text': 'Text to be hashed.' };
}

describe('Hash API', function() {
  it('should generate a hash value for given input with MD5 algorithm', function(done) {
    fh.hash( getOptionsForAlgorithm('MD5'), function(err, res) {
      expect(err).to.not.exist;
      expect(res.hashvalue).to.be.a('string');
      done(err);
    });
  });

  it('should generate a hash value for given input with SHA1 algorithm', function(done) {
    fh.hash( getOptionsForAlgorithm('SHA1'), function(err, res) {
      expect(err).to.not.exist;
      expect(res.hashvalue).to.be.a('string');
      done(err);
    });
  });

  it('should generate a hash value for given input with SHA256 algorithm', function(done) {
    fh.hash( getOptionsForAlgorithm('SHA256'), function(err, res) {
      expect(err).to.not.exist;
      expect(res.hashvalue).to.be.a('string');
      done(err);
    });
  });

  it('should generate a hash value for given input with SHA512 algorithm', function(done) {
    fh.hash( getOptionsForAlgorithm('SHA512'), function(err, res) {
      expect(err).to.not.exist;
      expect(res.hashvalue).to.be.a('string');
      done(err);
    });
  });

});
