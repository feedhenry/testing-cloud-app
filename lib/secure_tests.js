var expect = require('chai').expect;
var fh = require('fh-mbaas-api');

var config = {
  rsa: {},
  aes: {},
  plaintext: "Text to be encrypted."
};

describe('Secure API', function() {
  it('should generate private and public RSA key with keysize 1024', function(done) {
    this.timeout(5000);
    fh.sec({
      "act": 'keygen',
      "params": {
        "algorithm": "RSA",
        "keysize": 1024
      }
    }, function(err, res) {
      try {
        expect(err).to.not.exist;
        expect(res.public).to.be.a('string');
        expect(res.private).to.be.a('string');
        expect(res.modulu).to.be.a('string');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should generate private and public RSA key with keysize 2048', function(done) {
    // Very demanding operation, locally takes cca 5 seconds
    this.timeout(20000);
    fh.sec({
      "act": 'keygen',
      "params": {
        "algorithm": "RSA",
        "keysize": 2048
      }
    }, function(err, res) {
      try {
        expect(err).to.not.exist;
        expect(res.public).to.be.a('string');
        expect(res.private).to.be.a('string');
        expect(res.modulu).to.be.a('string');
        config.rsa.publickey = res.public;
        config.rsa.privatekey = res.private;
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should encrypt plain text with RSA algorithm', function(done) {
    fh.sec({
      "act": 'encrypt',
      "params": {
        "algorithm": "RSA",
        "plaintext": config.plaintext,
        "public": config.rsa.publickey
      }
    }, function(err, res) {
      try {
        expect(err).to.not.exist;
        // Returns ciphertext as a Buffer object
        expect(typeof res.ciphertext).to.be.equal('object');
        config.rsa.ciphertext = res.ciphertext;
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should decrypt plain text with RSA algorithm', function(done) {
    fh.sec({
      "act": 'decrypt',
      "params": {
        "algorithm": "RSA",
        "ciphertext": config.rsa.ciphertext,
        "private": config.rsa.privatekey
      }
    }, function(err, res) {
      try {
        expect(err).to.not.exist;
        // Returns plaintext as a Buffer object
        expect(typeof res.plaintext).to.be.equal('object');
        expect(res.plaintext.toString()).to.be.equal(config.plaintext);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should generate AES secret key and initialisation vector with keysize 128', function(done) {
    fh.sec({
      "act": 'keygen',
      "params": {
        "algorithm": "AES",
        "keysize": 128
      }
    }, function(err, res) {
      expect(err).to.not.exist;
      expect(res.secretkey).to.be.a('string');
      expect(res.iv).to.be.a('string');
      done(err);
    });
  });

  it('should generate AES secret key and initialisation vector with keysize 256', function(done) {
    fh.sec({
      "act": 'keygen',
      "params": {
        "algorithm": "AES",
        "keysize": 256
      }
    }, function(err, res) {
      try {
        expect(err).to.not.exist;
        expect(res.secretkey).to.be.a('string');
        expect(res.iv).to.be.a('string');
        config.aes.secretkey = res.secretkey;
        config.aes.iv = res.iv;
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should encrypt plain text with AES algorithm', function(done) {
    fh.sec({
      "act": 'encrypt',
      "params": {
        "algorithm": "AES",
        "plaintext": config.plaintext,
        "key": config.aes.secretkey,
        "iv": config.aes.iv
      }
    }, function(err, res) {
      try {
        expect(err).to.not.exist;
        expect(res.ciphertext).to.be.a('string');
        config.aes.ciphertext = res.ciphertext;
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should decrypt plain text with AES algorithm', function(done) {
    fh.sec({
      "act": 'decrypt',
      "params": {
        "algorithm": "AES",
        "ciphertext": config.aes.ciphertext,
        "key": config.aes.secretkey,
        "iv": config.aes.iv
      }
    }, function(err, res) {
      try {
        expect(err).to.not.exist;
        expect(res.plaintext).to.be.equal(config.plaintext);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

});
