var expect = require('chai').expect;
var fh = require('fh-mbaas-api');

/* DO NOT CHANGE THESE VARIABLES */
var testingString = 'Text to be hashed.';
var hashes = {
  md5: 'f59e474367376a1b3afeba7f6af8fb47',
  sha1: 'ce8e473e29353c1b5d58bd5554299cebb1c0faed',
  sha256: '3d6ff858cadeb324e75f2ac7ef555ce8453bd44deb7206b72baec1f4b646d566',
  sha512: '0f9627b88165cd6c727642979ad200faa6dea1afe3600686df6feae47115cbd5950e6d94978cde9578e88e3c1b6285d704ad606609dcc61f4707714f48195957'
};

/**
 * Creates a hash according to a given algorithm and checks its type and length
 * @param algorithm {string}  MD5/SHA1/SHA256/SHA512
 * @param length    {number}  Length of the hash that should be created
 * @param done      {object}
 */
function performHashCheck(algorithm, length, done) {
  fh.hash({
    'algorithm': algorithm,
    'text': testingString
  }, function(err, res) {
    try {
      expect(err).to.not.exist;
      expect(res.hashvalue)
        .to.be.a('string')
        .to.have.lengthOf(length)
        .to.eql(hashes[algorithm]);
      done();
    } catch (e) {
      done(e);
    }

  });
}

describe('Hash API', function() {
  it('should generate a hash value for given input with MD5 algorithm', performHashCheck.bind(null, 'md5', 32));
  it('should generate a hash value for given input with SHA1 algorithm', performHashCheck.bind(null, 'sha1', 40));
  it('should generate a hash value for given input with SHA256 algorithm', performHashCheck.bind(null, 'sha256', 64));
  it('should generate a hash value for given input with SHA512 algorithm', performHashCheck.bind(null, 'sha512', 128));
});
