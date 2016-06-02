var expect = require('chai').expect;
var fh = require('fh-mbaas-api');

/**
 * Creates a hash according to a given algorithm and checks its type and length
 * @param algorithm {string}  MD5/SHA1/SHA256/SHA512
 * @param length    {number}  Length of the hash that should be created
 * @param done      {object}
 */
function performHashCheck(algorithm, length, done) {
  fh.hash({
    'algorithm': algorithm,
    'text': 'Text to be hashed.'
  }, function(err, res) {
    expect(err).to.not.exist;
    expect(res.hashvalue)
      .to.be.a('string')
      .to.have.lengthOf(length);
    done(err);
  });
}

describe('Hash API', function() {
  it('should generate a hash value for given input with MD5 algorithm', performHashCheck.bind(null, 'MD5', 32));
  it('should generate a hash value for given input with SHA1 algorithm', performHashCheck.bind(null, 'SHA1', 40));
  it('should generate a hash value for given input with SHA256 algorithm', performHashCheck.bind(null, 'SHA256', 64));
  it('should generate a hash value for given input with SHA512 algorithm', performHashCheck.bind(null, 'SHA512', 128));
});
